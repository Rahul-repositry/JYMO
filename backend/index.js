const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./controllers/error.controller.js");
const authRoutes = require("./routes/auth.route.js");
const jymAuthRoutes = require("./routes/jymAuth.route.js");
const jymRoutes = require("./routes/jym.route.js");
const workoutRoutes = require("./routes/workout.route.js");
const attendanceRoutes = require("./routes/attendance.route.js");
const membershipRoutes = require("./routes/membership.route.js");
const userRoutes = require("./routes/user.route.js");
const cronRoutes = require("./routes/cron.route.js");
const cors = require("cors");
const CustomError = require("./utils/CustomError.utils.js");

const app = express();
const port = process.env.PORT || 3003;

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/jym", jymRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/jym", jymAuthRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/cron", cronRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello, World!" });
});
app.get("*", (req, res, next) => {
  next(new CustomError("JUID is incorrect", 404));
});
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log("server running on " + port + " port");
});
