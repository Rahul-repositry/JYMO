const Jym = require("../models/jym.model.js");
const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");
const CustomError = require("../utils/CustomError.utils.js");

const getJym = AsyncErrorHandler(async (req, res, next) => {
  const { JUID } = req.params;
  console.log(req.params);
  const jym = await Jym.findOne(
    { jymUniqueId: Number(JUID) },
    { name: 1, addressLocation: 1, owners: 1, subscriptionFee: 1 } // Include these fields
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

module.exports = { getJym };
