const Jym = require("../models/jym.model.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const CustomError = require("../utils/CustomError.utils.js");
const { ObjectId } = require("mongoose").Types;

const getJym = AsyncErrorHandler(async (req, res, next) => {
  const { JUID } = req.params;
  console.log(req.params);
  const jym = await Jym.findOne(
    { jymUniqueId: Number(JUID) },
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
    return next(new CustomError("JUID is incorrect", 404));
  }
  return res.status(200).json({
    sucess: true,
    data: jym,
    message: "Jym found",
  });
});

const getJymById = AsyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(req.params);
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

module.exports = { getJym, getJymById };
