import { Jym } from "../models/jym.model";
import { AsyncErrorHandler } from "../utils/AsyncErrorHandler.utils";
import CustomError from "../utils/CustomError.utils";

const getJym = AsyncErrorHandler(async (req, res, next) => {
  const { JUID } = req.params;
  const jym = await Jym.findOne({ jymUniqueId: JUID });
  if (!jym) {
    return next(new CustomError("JID is incorrect", 404));
  }
  return res.status(200).json({
    sucess: true,
    data: jym,
    message: "Jym found",
  });
});

module.exports = { getJym };
