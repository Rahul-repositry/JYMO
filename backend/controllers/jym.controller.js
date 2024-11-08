const CheckInSummary = require("../models/checkInSummary.model.js");
const Jym = require("../models/jym.model.js");
const Membership = require("../models/membership.model.js");
const User = require("../models/user.model.js");
const { UserDurationInJym } = require("../models/userDuration.model.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const CustomError = require("../utils/CustomError.utils.js");
const { filterJymDetails } = require("../utils/ImpFunc.js");
const { ObjectId } = require("mongoose").Types;
const dotenv = require("dotenv");
dotenv.config();
const getJym = AsyncErrorHandler(async (req, res, next) => {
  const { JUID } = req.params;
  console.log(req.params);
  const jym = await Jym.findOne({ jymUniqueId: Number(JUID) });
  if (!jym) {
    return next(new CustomError("JUID is incorrect", 404));
  }
  return res.status(200).json({
    success: true,
    data: filterJymDetails(jym),
    message: "Jym found",
  });
});

const jymDetails = AsyncErrorHandler(async (req, res, next) => {
  const { _id } = req.jym;
  const jym = await Jym.findOne({ _id: new ObjectId(_id) });
  if (!jym) {
    return next(new CustomError("JUID is incorrect", 404));
  }
  return res.status(200).json({
    success: true,
    jymData: filterJymDetails(jym),
    message: "Jym found",
  });
});

const getJymById = AsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const jym = await Jym.findOne(
    { _id: new ObjectId(id) },
    {
      name: 1,
      addressLocation: 1,
      owners: 1,
      subscriptionFee: 1,
      phoneNumbers: 1,
      jymUniqueId: 1,
    } // Include these fields
  );
  if (!jym) {
    return next(new CustomError("ID is incorrect", 404));
  }
  return res.status(200).json({
    success: true,
    jymData: jym,
    message: "Jym found",
  });
});

const getDashboardStats = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.jym._id;
  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Calculate the start of the current week (Monday)
  const startOfWeek = new Date(currentDate);
  const dayOfWeek = startOfWeek.getDay();
  const diff = (dayOfWeek + 6) % 7; // Move back to Monday
  startOfWeek.setDate(currentDate.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const FIFTEEN_DAYS = process.env.INACTIVE_IN_DAYS * 24 * 60 * 60 * 1000;
  const FIVE_DAYS =
    process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000;

  if (!ObjectId.isValid(jymId)) {
    return next(new CustomError("Invalid jymId", 403));
  }

  try {
    const membershipStats = await Membership.aggregate([
      {
        $match: {
          jymId: new ObjectId(jymId),
        },
      },
      { $sort: { userId: 1, endDate: -1 } },
      {
        $group: {
          _id: "$userId",
          mostRecentMembership: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$mostRecentMembership" },
      },
      {
        $facet: {
          activeInactive: [
            {
              $addFields: {
                isActive: {
                  $lte: [
                    { $subtract: [currentDate, "$status.active.lastCheckIn"] },
                    FIFTEEN_DAYS,
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                active: { $sum: { $cond: ["$isActive", 1, 0] } },
                inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
              },
            },
          ],
          paidUnpaid: [
            {
              $group: {
                _id: null,
                paid: {
                  $sum: { $cond: [{ $gt: ["$endDate", currentDate] }, 1, 0] },
                },
                unpaid: {
                  $sum: { $cond: [{ $lte: ["$endDate", currentDate] }, 1, 0] },
                },
              },
            },
          ],
          expiringSoon: [
            {
              $group: {
                _id: null,
                expiringSoon: {
                  $sum: {
                    $cond: [
                      {
                        $lte: [
                          "$endDate",
                          new Date(currentDate.getTime() + FIVE_DAYS),
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          totalRevenue: [
            {
              $match: { createdAt: { $gte: startOfMonth } },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ]);

    const userDurationStats = await UserDurationInJym.aggregate([
      {
        $match: {
          jymId: new ObjectId(jymId),
        },
      },
      {
        $project: {
          firstJoinDate: { $arrayElemAt: ["$joinDates", 0] },
        },
      },
      {
        $group: {
          _id: null,
          newlyRegistered: {
            $sum: {
              $cond: [
                {
                  $lte: [
                    { $subtract: [currentDate, "$firstJoinDate"] },
                    FIVE_DAYS,
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    // Fetch check-ins for the current week with .lean()
    const chqInSummaryOfJym = await CheckInSummary.findOne({
      jymId: jymId,
      startOfWeek: startOfWeek,
    }).lean(); // .lean() to avoid circular references

    // Aggregation for gender counts
    const genderCounts = await User.aggregate([
      {
        $unwind: "$currentJymUUId",
      },
      {
        $match: {
          "currentJymUUId.jymId": new ObjectId(jymId),
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    // Default values if no data found
    const activeInactiveStats = membershipStats[0]?.activeInactive[0] || {
      active: 0,
      inactive: 0,
    };
    const paidUnpaidStats = membershipStats[0]?.paidUnpaid[0] || {
      paid: 0,
      unpaid: 0,
    };
    const expiringSoonStats = membershipStats[0]?.expiringSoon[0] || {
      expiringSoon: 0,
    };
    const totalRevenueStats = membershipStats[0]?.totalRevenue[0] || {
      totalRevenue: 0,
    };
    const newlyRegisteredStats = userDurationStats[0] || { newlyRegistered: 0 };

    const data = {
      active: activeInactiveStats.active,
      inactive: activeInactiveStats.inactive,
      paid: paidUnpaidStats.paid,
      unpaid: paidUnpaidStats.unpaid,
      expiringSoon: expiringSoonStats.expiringSoon,
      totalRevenue: totalRevenueStats.totalRevenue,
      newlyRegistered: newlyRegisteredStats.newlyRegistered,
      chqInSummaryOfJym: chqInSummaryOfJym || {},
      genderCounts: genderCounts.length
        ? genderCounts
        : [
            { _id: "male", count: 0 },
            { _id: "female", count: 0 },
          ],
    };

    res.status(200).json({
      success: true,
      jymData: data,
      message: "Dashboard data fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    next(new CustomError("Failed to fetch dashboard stats", 500));
  }
});

const getUsersByStatus = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.jym._id;
  const { statusType, skip = 0 } = req.query;

  if (!ObjectId.isValid(jymId)) {
    return next(new CustomError("Invalid gym ID", 400));
  }

  const currentDate = new Date();
  const checkInDateLimit = new Date(
    currentDate.getTime() - process.env.INACTIVE_IN_DAYS * 24 * 60 * 60 * 1000
  );
  const fiveDaysAgo = new Date(
    currentDate.getTime() -
      process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000
  );
  const fiveDaysFromNow = new Date(
    currentDate.getTime() +
      process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000
  );

  try {
    const results = await Membership.aggregate([
      { $match: { jymId: new ObjectId(jymId) } },

      // Sort by userId and endDate to get the latest membership first
      { $sort: { userId: 1, endDate: -1 } },

      // Group by userId, retaining only the latest membership per user
      {
        $group: {
          _id: "$userId",
          mostRecentMembership: { $first: "$$ROOT" },
        },
      },

      // Replace the root document with the most recent membership
      {
        $replaceRoot: { newRoot: "$mostRecentMembership" },
      },

      // Apply status-based filters on the latest memberships
      ...(statusType.toLowerCase() === "active"
        ? [
            {
              $match: {
                "status.active.lastCheckIn": { $gte: checkInDateLimit },
              },
            },
          ]
        : statusType.toLowerCase() === "inactive"
        ? [
            {
              $match: {
                "status.active.lastCheckIn": { $lt: checkInDateLimit },
              },
            },
          ]
        : statusType.toLowerCase() === "newlyregistered"
        ? [
            {
              $lookup: {
                from: "userdurations",
                let: { userId: "$userId" },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ["$userId", "$$userId"] },
                      isQuitted: false,
                    },
                  },
                  {
                    $project: {
                      userId: 1,
                      firstJoinDate: { $arrayElemAt: ["$joinDates", 0] },
                    },
                  },
                  { $match: { firstJoinDate: { $gte: fiveDaysAgo } } },
                ],
                as: "recentJoinInfo",
              },
            },
            { $match: { recentJoinInfo: { $ne: [] } } },
          ]
        : statusType.toLowerCase() === "expiringsoon"
        ? [{ $match: { endDate: { $lte: fiveDaysFromNow } } }]
        : statusType.toLowerCase() === "paid"
        ? [{ $match: { endDate: { $gt: currentDate } } }]
        : statusType.toLowerCase() === "unpaid"
        ? [{ $match: { "status.active.lastCheckIn": { $gt: "$endDate" } } }]
        : []),

      { $skip: parseInt(skip) },
      { $limit: 20 },

      // Lookup user details and project fields
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },

      // Apply gender filter after populating userInfo
      ...(["male", "female", "others"].includes(statusType.toLowerCase())
        ? [{ $match: { "userInfo.gender": statusType.toLowerCase() } }]
        : []),

      {
        $project: {
          img: "$userInfo.img",
          username: "$userInfo.username",
          startDate: "$startDate",
          endDate: "$endDate",
          lastCheckIn: "$status.active.lastCheckIn",
          status: "$status",
          phone: "$userInfo.phone",
          userId: "$userInfo._id",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Error fetching users by status:", error);
    return next(new CustomError("Failed to fetch users by status", 500));
  }
});

const getUserBySearch = AsyncErrorHandler(async (req, res, next) => {
  const { userId } = req.params;
  const jymId = req.jym._id;
  if (!ObjectId.isValid(userId)) {
    return next(new CustomError("Invalid user ID", 400));
  }

  try {
    // Fetch the most recent membership data for the specified user
    const userMembershipData = await Membership.findOne({
      userId: new ObjectId(userId),
      jymId: new ObjectId(jymId),
    })
      .sort({ endDate: -1 }) // Sorting by endDate to get the most recent membership
      .populate({
        path: "userId",
        select: "username phone img _id", // Populate selected fields
      });

    if (!userMembershipData) {
      return next(
        new CustomError("Membership data not found for the user", 404)
      );
    }

    // Format the response to match `getUsersByStatus`
    const formattedData = {
      img: userMembershipData.userId.img,
      username: userMembershipData.userId.username,
      startDate: userMembershipData.startDate,
      endDate: userMembershipData.endDate,
      lastCheckIn: userMembershipData.status?.active?.lastCheckIn,
      status: userMembershipData.status,
      phone: userMembershipData.userId.phone,
      userId: userMembershipData.userId._id,
    };

    res.status(200).json({
      success: true,
      data: formattedData,
      message: "Member found",
    });
  } catch (err) {
    console.error("Error fetching user by search:", err);
    return next(new CustomError("This user is not present in you jym", 500));
  }
});

const editJymDetails = AsyncErrorHandler(async (req, res, next) => {
  const { name, recoveryNumber, addressLocation, phoneNumbers, _id } = req.body;

  // Validate input: ensure all fields are of expected type
  if (name && typeof name !== "string") {
    return next(new CustomError("Invalid name format", 400));
  }

  if (recoveryNumber && typeof recoveryNumber !== "string") {
    return next(new CustomError("Invalid recovery number format", 400));
  }

  if (addressLocation && typeof addressLocation !== "object") {
    return next(new CustomError("Invalid address format", 400));
  }

  if (phoneNumbers && !Array.isArray(phoneNumbers)) {
    return next(new CustomError("Phone numbers must be an array", 400));
  }

  // Construct the update object, including only provided fields
  const updateData = {};
  if (name) updateData.name = name;
  if (recoveryNumber) updateData.recoveryNumber = recoveryNumber;
  if (addressLocation) updateData.addressLocation = addressLocation;
  if (phoneNumbers) updateData.phoneNumbers = phoneNumbers;

  try {
    // Find the gym by ID and update only allowed fields
    const updatedJym = await Jym.findByIdAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    // If no gym found, send an error
    if (!updatedJym) {
      return next(new CustomError("Gym not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Gym details updated successfully",
      data: filterJymDetails(updatedJym),
    });
  } catch (error) {
    console.error("Error updating gym details:", error);
    return next(new CustomError("Failed to update gym details", 500));
  }
});

module.exports = {
  getJym,
  getJymById,
  jymDetails,
  getDashboardStats,
  getUsersByStatus,
  getUserBySearch,
  editJymDetails,
};
