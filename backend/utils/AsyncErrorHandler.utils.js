const AsyncErrorHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (err) {
      console.log("generatederr AsyncHandler", err);
      next(err);
    }
  };
};

module.exports = { AsyncErrorHandler };
