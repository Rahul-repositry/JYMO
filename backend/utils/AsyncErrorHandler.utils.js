const AsyncErrorHandler = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
};

module.exports = { AsyncErrorHandler };
