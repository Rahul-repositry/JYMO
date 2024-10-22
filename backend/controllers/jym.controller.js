const CheckInSummary = require("../models/checkInSummary.model.js");
const Jym = require("../models/jym.model.js");
const Membership = require("../models/membership.model.js");
const User = require("../models/user.model.js");
const { UserDurationInJym } = require("../models/userDuration.model.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const CustomError = require("../utils/CustomError.utils.js");
const { filterJymDetails } = require("../utils/ImpFunc.js");
const { ObjectId } = require("mongoose").Types;

const getJym = AsyncErrorHandler(async (req, res, next) => {
  const { JUID } = req.params;
  console.log(req.params);
  const jym = await Jym.findOne({ jymUniqueId: Number(JUID) });
  if (!jym) {
    return next(new CustomError("JUID is incorrect", 404));
  }
  return res.status(200).json({
    sucess: true,
    data: filterJymDetails(jym),
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
    sucess: true,
    jymData: jym,
    message: "Jym found",
  });
});

const getDashboardStats = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.jym._id;
  console.log(jymId);
  if (!ObjectId.isValid(jymId)) {
    next(new CustomError("Invalid jymId", 403));
    return;
  }

  const currentDate = new Date();
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;
  const FIVE_DAYS = 5 * 24 * 60 * 60 * 1000;

  try {
    const membershipStats = await Membership.aggregate([
      {
        $match: {
          jymId: new ObjectId(jymId),
        },
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

    const chqInSummaryOfJym = await CheckInSummary.findOne({
      jymId: new ObjectId(jymId),
    });

    const genderCounts = await User.aggregate([
      {
        $unwind: "$currentJymUUId",
      },
      {
        $match: {
          currentJymUUId: new ObjectId(jymId),
        },
      },
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

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

    let data = {
      active: activeInactiveStats.active,
      inactive: activeInactiveStats.inactive,
      paid: paidUnpaidStats.paid,
      unpaid: paidUnpaidStats.unpaid,
      expiringSoon: expiringSoonStats.expiringSoon,
      totalRevenue: totalRevenueStats.totalRevenue,
      newlyRegistered: newlyRegisteredStats.newlyRegistered,
      chqInSummaryOfJym: chqInSummaryOfJym || {},
      genderCounts,
    };

    res.status(200).json({
      success: true,
      jymData: data,
      message: "dashboard data",
    });
    return;
  } catch (error) {
    console.error("Error fetching membership stats:", error);
    throw error;
  }
});

module.exports = { getJym, getJymById, getDashboardStats };
