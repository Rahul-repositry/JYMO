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
                isActive: "$status.active.value", // Directly use the true/false value of status.active.value
              },
            },
            {
              $group: {
                _id: null,
                active: { $sum: { $cond: ["$isActive", 1, 0] } }, // Count documents where isActive is true
                inactive: { $sum: { $cond: ["$isActive", 0, 1] } }, // Count documents where isActive is false
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
                  $sum: {
                    $cond: [
                      { $gt: ["$status.active.lastCheckIn", "$endDate"] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          expiringSoon: [
            {
              $addFields: {
                isExpiringSoon: {
                  $and: [
                    { $gte: ["$endDate", currentDate] },
                    {
                      $lte: [
                        "$endDate",
                        new Date(currentDate.getTime() + FIVE_DAYS),
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                expiringSoon: {
                  $sum: { $cond: ["$isExpiringSoon", 1, 0] },
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

    const genderCounts = await Membership.aggregate([
      // Match memberships with the given gym ID and active status
      { $match: { jymId: new ObjectId(jymId), "status.active.value": true } },

      // Sort memberships by userId and startDate (or createdAt) in descending order
      { $sort: { userId: 1, startDate: -1 } }, // Sort by userId first, then by recency

      // Group by userId to keep only the most recent membership
      {
        $group: {
          _id: "$userId", // Group by userId
          mostRecentMembership: { $first: "$$ROOT" }, // Take the most recent membership
        },
      },

      // Lookup the associated user data
      {
        $lookup: {
          from: "users", // The user collection
          localField: "_id", // userId from the grouped data
          foreignField: "_id", // Field from user to join on
          as: "userDetails", // Alias for the joined user data
        },
      },

      // Unwind the user details array (to make each document contain a single user)
      { $unwind: "$userDetails" },

      // Group by gender and aggregate memberships
      {
        $group: {
          _id: "$userDetails.gender", // Group by gender field
          count: { $sum: 1 }, // Count each occurrence
        },
      },

      // Project the results to make it more readable
      {
        $project: {
          gender: "$_id",
          count: 1,
          _id: 0,
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
            { _id: "others", count: 0 },
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

// const getUsersByStatus = AsyncErrorHandler(async (req, res, next) => {
//   const jymId = req.jym._id;
//   const { statusType, skip = 0 } = req.query;

//   if (!ObjectId.isValid(jymId)) {
//     return next(new CustomError("Invalid gym ID", 400));
//   }

//   const currentDate = new Date();
//   const checkInDateLimit = new Date(
//     currentDate.getTime() - process.env.INACTIVE_IN_DAYS * 24 * 60 * 60 * 1000
//   );
//   const fiveDaysAgo = new Date(
//     currentDate.getTime() -
//       process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000
//   );
//   const fiveDaysFromNow = new Date(
//     currentDate.getTime() +
//       process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000
//   );

//   try {
//     let newlyRegisteredUserIds = [];

//     // Step 1: Fetch user IDs of newly registered users if requested
//     if (statusType.toLowerCase() === "newlyregistered") {
//       const newlyRegisteredUsers = await UserDurationInJym.aggregate([
//         { $match: { jymId: new ObjectId(jymId), isQuitted: false } },
//         {
//           $project: {
//             userId: 1,
//             firstJoinDate: { $arrayElemAt: ["$joinDates", 0] },
//           },
//         },
//         { $match: { firstJoinDate: { $gte: fiveDaysAgo } } },
//         { $group: { _id: "$userId" } },
//       ]);
//       newlyRegisteredUserIds = newlyRegisteredUsers.map((doc) => doc._id);
//     }

//     // Step 2: Aggregate the latest memberships based on the specified status
//     const results = await Membership.aggregate([
//       { $match: { jymId: new ObjectId(jymId) } },
//       { $sort: { userId: 1, endDate: -1 } },
//       {
//         $group: {
//           _id: "$userId",
//           mostRecentMembership: { $first: "$$ROOT" },
//         },
//       },
//       { $replaceRoot: { newRoot: "$mostRecentMembership" } },

//       // Step 3: Apply status-based filtering
//       ...getStatusMatchPipeline(
//         statusType,
//         checkInDateLimit,
//         fiveDaysFromNow,
//         currentDate,
//         newlyRegisteredUserIds
//       ),

//       // Step 4: Pagination
//       { $skip: parseInt(skip) },
//       // { $limit: 20 },
//       { $limit: 2 },

//       // Step 5: Populate user info
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userInfo",
//         },
//       },
//       { $unwind: "$userInfo" },

//       // Step 6: Gender-based filtering (optional)
//       ...getGenderMatchPipeline(statusType),

//       // Step 7: Projection for final output
//       {
//         $project: {
//           img: "$userInfo.img",
//           username: "$userInfo.username",
//           startDate: "$startDate",
//           endDate: "$endDate",
//           lastCheckIn: "$status.active.lastCheckIn",
//           status: "$status",
//           phone: "$userInfo.phone",
//           userId: "$userInfo._id",
//         },
//       },
//     ]);
//     console.log(results, skip);
//     res.status(200).json({
//       success: true,
//       data: results,
//     });
//   } catch (error) {
//     console.error("Error fetching users by status:", error);
//     return next(new CustomError("Failed to fetch users by status", 500));
//   }
// });

// // Helper function to handle status-based matching logic
// function getStatusMatchPipeline(
//   statusType,
//   checkInDateLimit,
//   fiveDaysFromNow,
//   currentDate,
//   newlyRegisteredUserIds
// ) {
//   const today = new Date(); // Current date

//   switch (statusType.toLowerCase()) {
//     case "active":
//       return [
//         { $match: { "status.active.lastCheckIn": { $gte: checkInDateLimit } } },
//       ];
//     case "inactive":
//       return [
//         { $match: { "status.active.lastCheckIn": { $lt: checkInDateLimit } } },
//       ];
//     case "newlyregistered":
//       return [{ $match: { userId: { $in: newlyRegisteredUserIds } } }];
//     case "expiringsoon":
//       return [
//         {
//           $match: {
//             endDate: {
//               $gt: today, // Greater than today
//               $lte: fiveDaysFromNow, // Less than or equal to five days from now
//             },
//           },
//         },
//       ];
//     case "paid":
//       return [{ $match: { endDate: { $gt: currentDate } } }];
//     case "unpaid":
//       return [
//         {
//           $match: {
//             $expr: { $gt: ["$status.active.lastCheckIn", "$endDate"] },
//           },
//         },
//       ];
//     default:
//       return [];
//   }
// }

// // Helper function to handle gender-based matching
// function getGenderMatchPipeline(statusType) {
//   const genderTypes = ["male", "female", "others"];
//   if (genderTypes.includes(statusType.toLowerCase())) {
//     return [{ $match: { "userInfo.gender": statusType.toLowerCase() } }];
//   }
//   return [];
// }

const getUsersByStatus = AsyncErrorHandler(async (req, res, next) => {
  const jymId = req.jym._id;
  const { statusType, skip = 0, limit = 20 } = req.query;

  if (!ObjectId.isValid(jymId)) {
    return next(new CustomError("Invalid gym ID", 400));
  }

  try {
    const queryHandler = getStatusQueryHandler(statusType);
    const results = await queryHandler(jymId, parseInt(skip), parseInt(limit));

    res.status(200).json({
      success: true,
      data: results,
      hasMore: results.length === limit, // Indicate if there's more data to load
    });
  } catch (error) {
    console.error("Error fetching users by status:", error);
    return next(new CustomError("Failed to fetch users by status", 500));
  }
});

function getStatusQueryHandler(statusType) {
  const handlers = {
    active: fetchActiveUsers,
    inactive: fetchInactiveUsers,
    newlyregistered: fetchNewlyRegisteredUsers,
    expiringsoon: fetchExpiringSoonUsers,
    paid: fetchPaidUsers,
    unpaid: fetchUnpaidUsers,
    male: fetchUsersByGender.bind(null, "male"),
    female: fetchUsersByGender.bind(null, "female"),
    others: fetchUsersByGender.bind(null, "others"),
  };

  return (
    handlers[statusType.toLowerCase()] ||
    (() => {
      throw new Error("Invalid status type");
    })
  );
}

// async function fetchActiveUsers(jymId, skip = 0, limit = 20) {
//   const checkInDateLimit = new Date(
//     Date.now() - process.env.INACTIVE_IN_DAYS * 24 * 60 * 60 * 1000
//   );

//   // Fetch memberships sorted by userId and endDate, then filter on the server side
//   const memberships = await Membership.aggregate([
//     {
//       $match: {
//         jymId: new ObjectId(jymId),
//       },
//     },
//     {
//       $sort: { startDate: -1 },
//     },
//     {
//       $group: {
//         _id: "$userId",
//         latestMembership: { $first: "$$ROOT" },
//       },
//     },
//     {
//       $match: {
//         $or: [
//           {
//             "latestMembership.status.active.lastCheckIn": {
//               $lt: checkInDateLimit,
//             },
//           },
//           { "latestMembership.status.active.value": false },
//         ],
//       },
//     },
//     {
//       $replaceRoot: { newRoot: "$latestMembership" },
//     },
//     {
//       $skip: skip,
//     },
//     {
//       $limit: limit,
//     },
//   ]);

//   // Filter memberships to keep only the latest per userId
//   const uniqueMemberships = [];
//   const seenUserIds = new Set();

//   for (const membership of memberships) {
//     if (!seenUserIds.has(membership.userId.toString())) {
//       uniqueMemberships.push(membership);
//       seenUserIds.add(membership.userId.toString());
//     }
//     if (uniqueMemberships.length >= limit) break; // Stop once we have enough records
//   }

//   // Fetch user details for these user IDs
//   const userIds = uniqueMemberships.map((membership) => membership.userId);
//   const users = await User.find({ _id: { $in: userIds } })
//     .select("img username phone")
//     .lean();

//   // Combine user data with the filtered memberships
//   return uniqueMemberships.map((membership) => {
//     const userInfo = users.find((user) => user._id.equals(membership.userId));
//     return {
//       img: userInfo?.img || null,
//       username: userInfo?.username || null,
//       phone: userInfo?.phone || null,
//       userId: membership.userId,
//       startDate: membership.startDate,
//       endDate: membership.endDate,
//       lastCheckIn: membership.status.active.lastCheckIn,
//       status: membership.status,
//     };
//   });
// }

async function fetchActiveUsers(jymId, skip = 0, limit = 20) {
  const activeMemberships = await Membership.aggregate([
    {
      $match: {
        jymId: new ObjectId(jymId),
      },
    },
    {
      $sort: { startDate: -1 },
    },
    {
      $group: {
        _id: "$userId",
        latestMembership: { $first: "$$ROOT" },
      },
    },
    {
      $match: {
        $or: [{ "latestMembership.status.active.value": true }],
      },
    },
    {
      $replaceRoot: { newRoot: "$latestMembership" },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  // Extract userIds from the latest memberships
  const userIds = activeMemberships.map((membership) => membership.userId);

  // Fetch user details
  const users = await User.find({ _id: { $in: userIds } })
    .select("img username phone")
    .lean();

  // Format the final response
  return activeMemberships.map((membership) => {
    const userInfo = users.find((user) => user._id.equals(membership.userId));
    return {
      img: userInfo?.img || null,
      username: userInfo?.username || null,
      phone: userInfo?.phone || null,
      userId: membership.userId,
      startDate: membership.startDate,
      endDate: membership.endDate,
      lastCheckIn: membership.status.active.lastCheckIn,
      status: membership.status,
    };
  });
}

async function fetchInactiveUsers(jymId, skip = 0, limit = 20) {
  const checkInDateLimit = new Date(
    Date.now() - process.env.INACTIVE_IN_DAYS * 24 * 60 * 60 * 1000
  );

  const inactiveMemberships = await Membership.aggregate([
    {
      $match: {
        jymId: new ObjectId(jymId),
      },
    },
    {
      $sort: { startDate: -1 },
    },
    {
      $group: {
        _id: "$userId",
        latestMembership: { $first: "$$ROOT" },
      },
    },
    {
      $match: {
        $or: [
          {
            "latestMembership.status.active.lastCheckIn": {
              $lt: checkInDateLimit,
            },
          },
          { "latestMembership.status.active.value": false },
        ],
      },
    },
    {
      $replaceRoot: { newRoot: "$latestMembership" },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  // Extract userIds from the latest memberships
  const userIds = inactiveMemberships.map((membership) => membership.userId);

  // Fetch user details
  const users = await User.find({ _id: { $in: userIds } })
    .select("img username phone")
    .lean();

  // Format the final response
  return inactiveMemberships.map((membership) => {
    const userInfo = users.find((user) => user._id.equals(membership.userId));
    return {
      img: userInfo?.img || null,
      username: userInfo?.username || null,
      phone: userInfo?.phone || null,
      userId: membership.userId,
      startDate: membership.startDate,
      endDate: membership.endDate,
      lastCheckIn: membership.status.active.lastCheckIn,
      status: membership.status,
    };
  });
}

async function fetchNewlyRegisteredUsers(jymId, skip = 0, limit = 20) {
  const newlyRegisteredDate = new Date(
    Date.now() -
      process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000
  );

  const userDurations = await UserDurationInJym.find({
    jymId: new ObjectId(jymId),
    isQuitted: false,
    joinDates: { $gte: newlyRegisteredDate },
  })
    .select("userId")
    .lean();

  const userIds = userDurations.map((duration) => duration.userId);

  const newlyRegisteredMemberships = await Membership.find({
    jymId: new ObjectId(jymId),
    userId: { $in: userIds },
  })
    .sort({ userId: 1, endDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const users = await User.find({ _id: { $in: userIds } })
    .select("img username phone")
    .lean();

  return newlyRegisteredMemberships.map((membership) => {
    const userInfo = users.find((user) => user._id.equals(membership.userId));
    return {
      img: userInfo?.img || null,
      username: userInfo?.username || null,
      phone: userInfo?.phone || null,
      userId: membership.userId,
      startDate: membership.startDate,
      endDate: membership.endDate,
      lastCheckIn: membership.status.active.lastCheckIn,
      status: membership.status,
    };
  });
}

async function fetchExpiringSoonUsers(jymId, skip = 0, limit = 20) {
  const expiryDateLimit = new Date(
    Date.now() +
      process.env.EXPIRY_AND_NEWLYREGISTERED_IN_DAYS * 24 * 60 * 60 * 1000
  );

  try {
    // Step 1: Fetch expiring memberships
    const expiringMemberships = await Membership.find({
      jymId: new ObjectId(jymId),
      endDate: { $gte: new Date(), $lte: expiryDateLimit }, // Ensure endDate is within the correct range
    })
      .sort({ userId: 1, endDate: -1 }) // Sort by userId and most recent endDate
      .skip(skip)
      .limit(limit)
      .lean();

    if (expiringMemberships.length === 0) {
      return []; // No memberships found within the range
    }

    // Step 2: Extract user IDs from memberships
    const userIds = expiringMemberships.map((membership) => membership.userId);

    // Step 3: Fetch user details
    const users = await User.find({ _id: { $in: userIds } })
      .select("img username phone")
      .lean();

    // Step 4: Map memberships to user details
    return expiringMemberships.map((membership) => {
      const userInfo = users.find((user) => user._id.equals(membership.userId));
      return {
        img: userInfo?.img || null,
        username: userInfo?.username || null,
        phone: userInfo?.phone || null,
        userId: membership.userId,
        startDate: membership.startDate,
        endDate: membership.endDate,
        lastCheckIn: membership.status.active.lastCheckIn,
        status: membership.status,
      };
    });
  } catch (error) {
    console.error("Error fetching expiring soon users:", error);
    throw error; // Re-throw to handle the error in the calling function
  }
}

async function fetchPaidUsers(jymId, skip = 0, limit = 20) {
  const paidMemberships = await Membership.find({
    jymId: new ObjectId(jymId),
    endDate: { $gt: new Date() },
  })
    .sort({ userId: 1, endDate: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const userIds = paidMemberships.map((membership) => membership.userId);

  const users = await User.find({ _id: { $in: userIds } })
    .select("img username phone")
    .lean();

  return paidMemberships.map((membership) => {
    const userInfo = users.find((user) => user._id.equals(membership.userId));
    return {
      img: userInfo?.img || null,
      username: userInfo?.username || null,
      phone: userInfo?.phone || null,
      userId: membership.userId,
      startDate: membership.startDate,
      endDate: membership.endDate,
      lastCheckIn: membership.status.active.lastCheckIn,
      status: membership.status,
    };
  });
}

async function fetchUnpaidUsers(jymId, skip = 0, limit = 20) {
  const unpaidMemberships = await Membership.aggregate([
    {
      $match: {
        jymId: new ObjectId(jymId), // Filter by gym ID
      },
    },
    {
      $sort: {
        userId: 1, // Sort by user ID
        endDate: -1, // Within each user, sort by most recent end date
      },
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        latestMembership: { $first: "$$ROOT" }, // Keep the first document in each group (latest membership)
      },
    },
    {
      $replaceRoot: {
        newRoot: "$latestMembership", // Replace the root document with the latest membership
      },
    },
    {
      $match: {
        $expr: { $gt: ["$status.active.lastCheckIn", "$endDate"] }, // Apply the condition to the latest membership
      },
    },
    {
      $skip: skip, // Apply pagination
    },
    {
      $limit: limit, // Apply pagination
    },
  ]);

  const userIds = unpaidMemberships.map((membership) => membership.userId);

  const users = await User.find({ _id: { $in: userIds } })
    .select("img username phone")
    .lean();

  return unpaidMemberships.map((membership) => {
    const userInfo = users.find((user) => user._id.equals(membership.userId));
    return {
      img: userInfo?.img || null,
      username: userInfo?.username || null,
      phone: userInfo?.phone || null,
      userId: membership.userId,
      startDate: membership.startDate,
      endDate: membership.endDate,
      lastCheckIn: membership.status.active.lastCheckIn,
      status: membership.status,
    };
  });
}

async function fetchUsersByGender(gender, jymId, skip = 0, limit = 20) {
  // Step 1: Fetch users who match the given gender and are part of the given jymId
  const users = await User.find({
    gender, // Match the gender
    "currentJymUUId.jymId": new ObjectId(jymId), // Match the currentJymUUId array containing the jymId
  })
    .select("img username phone gender _id") // Select only necessary fields
    .lean();

  const userIds = users.map((user) => user._id); // Extract user IDs for the next step

  // Step 2: Fetch the latest membership for each user
  // const memberships = await Membership.find({
  //   userId: { $in: userIds }, // Filter memberships for the selected users
  //   jymId: new ObjectId(jymId), // Ensure memberships belong to the given jymId
  //   "status.active.value": true, // Only include active memberships
  // })
  //   .sort({ userId: 1, endDate: -1 }) // Sort by userId and latest endDate
  //   .skip(skip)
  //   .limit(limit)
  //   .lean();

  const memberships = await Membership.aggregate([
    {
      $match: {
        userId: { $in: userIds }, // Filter memberships for the selected users
        jymId: new ObjectId(jymId), // Ensure memberships belong to the given jymId
        "status.active.value": true, // Only include active memberships
      },
    },
    {
      $sort: { userId: 1, endDate: -1 }, // Sort by userId and latest endDate
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        latestMembership: { $first: "$$ROOT" }, // Select the first (latest) membership per userId
      },
    },
    {
      $replaceRoot: { newRoot: "$latestMembership" }, // Replace with the latest membership document
    },
    {
      $sort: { userId: 1 }, // Reapply sorting by userId
    },
    {
      $skip: skip, // Pagination: skip specified number of documents
    },
    {
      $limit: limit, // Pagination: limit to specified number of documents
    },
  ]);

  // Step 3: Map the memberships to the user data and ensure valid memberships only
  return memberships
    .map((membership) => {
      const userInfo = users.find((user) => user._id.equals(membership.userId)); // Find user by ID
      if (!userInfo) {
        return null; // Skip this membership if no corresponding user found
      }
      // if (!membership?.status?.active?.value) {
      //   return null;
      // }

      return {
        img: userInfo.img || null,
        username: userInfo.username || null,
        phone: userInfo.phone || null,
        userId: membership.userId,
        gender: userInfo.gender || null,
        startDate: membership.startDate,
        endDate: membership.endDate,
        lastCheckIn: membership.status.active.lastCheckIn,
        status: membership.status,
      };
    })
    .filter((membershipData) => membershipData !== null); // Filter out memberships with no matching user
}

// Additional functions for specific queries can be added here

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
      // return next(
      //   new CustomError("Membership data not found for the user", 404)
      // );

      const searchedUser = await User.findById({ _id: new ObjectId(userId) });

      if (!searchedUser) {
        return next(new CustomError("User not found", 404));
      }
      const formattedDataUser = {
        img: searchedUser.img,
        username: searchedUser.username,
        startDate: undefined,
        endDate: undefined,
        lastCheckIn: undefined,
        status: undefined,
        phone: searchedUser.phone,
        userId: searchedUser._id,
      };

      return res.status(200).json({
        success: true,
        data: formattedDataUser,
        message: "User found but not registered",
      });
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
