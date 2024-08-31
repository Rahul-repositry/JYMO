const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils.js");

const userData = AsyncErrorHandler((req, res, next) => {
  return res.status(200).json({ success: true, user: req.user });
});

module.exports = {
  userData,
};
