const CustomError = require("../utils/CustomError.utils.js");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: "fail",
    statusCode: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400);
};
const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400);
};
const duplicateKeyErrorHandler = (err) => {
  const obj = err.keyValue;
  const key = Object.keys(obj);
  const value = Object.values(obj);
  const msg = `User already exists with ${key} - ${value}. Please use another ${key}!`;
  console.log("is working duplicater error control", msg);
  return new CustomError(msg, 400);
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: "fail",
      statusCode: error.statusCode,
      message: error.message,
      success: false,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
      success: false,
    });
  }
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);

    prodErrors(res, error);
  }
};

module.exports = { globalErrorHandler };
