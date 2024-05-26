const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config("");

const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", msg: "Token is not valid" });
      } else {
        req.user = decoded.user;

        next();
      }
    });
  } else {
    return res.status(401).json({
      status: "error",
      msg: "You are not authenticated",
    });
  }
};

const verifyJym = (req, res, next) => {
  const token = req.cookies.access_jymToken;
  console.log({ token });

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: "error", msg: "Token is not valid" });
      } else {
        req.jym = decoded;

        next();
      }
    });
  } else {
    return res.status(401).json({
      status: "error",
      msg: "You are not authenticated",
    });
  }
};

module.exports = { verifyUser, verifyJym };
