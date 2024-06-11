const { AsyncErrorHandler } = require("../utils/AsyncErrorHandler.utils");
const CustomError = require("../utils/CustomError.utils");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const CustomError = require("../utils/CustomError.utils.js");
const jymoDietBackendUserModel = require("../models/jymoDietBackendUser.model");
// Other code using these imports

dotenv.config("");

//only creating signin bcz we are going to create user manually in db and we dont want other to get registered .

const signin = AsyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const validUser = await jymoDietBackendUserModel.findOne({ email });
  if (!validUser) return next(new CustomError("Not Authorized", 401));
  const validPassword = password === validUser.password;
  if (!validPassword) return next(new CustomError("invalid credentials", 401));
  const { password: hashedPassword, ...rest } = validUser._doc;
  const token = jwt.sign({ jymoDietBackendUser: rest }, process.env.JWT_SECRET);
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60); // 60 days
  res
    .cookie("jymoDietBackendUser_token", token, {
      httpOnly: true, // helps  prevent access to cookie through client-side scripting
      expires: expiryDate,
      // secure: true, // helps  with encrypting the cookie and prevents it being sent on http
    })
    .status(200)
    .json({ success: true, message: "SignIn successfully", user: rest });
});

module.exports = {
  signin,
};
