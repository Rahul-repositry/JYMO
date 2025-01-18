const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./controllers/error.controller.js");
const authRoutes = require("./routes/auth.route.js");
const jymAuthRoutes = require("./routes/jymAuth.route.js");
const jymRoutes = require("./routes/jym.route.js");
const workoutRoutes = require("./routes/workout.route.js");
const attendanceRoutes = require("./routes/attendance.route.js");
const membershipRoutes = require("./routes/membership.route.js");
const userRoutes = require("./routes/user.route.js");
const cors = require("cors");
const cron = require("node-cron");
const {
  updateInactiveMemberships,
} = require("./controllers/membership.controller.js");

const app = express();
const port = process.env.PORT || 3003;

dotenv.config();

mongoose
  .connect(process.env.MONGO_STR)
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Schedule the cron job to run at midnight every day
cron.schedule("0 0 * * *", updateInactiveMemberships, {
  timezone: "Asia/Kolkata", // Adjust timezone if needed
});

// Serve React static files
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/api/test", (req, res) => {
  res.send("hello world");
});
app.use("/api/user", userRoutes);
app.use("/api/jym", jymRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/jym", jymAuthRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/membership", membershipRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});
app.use(globalErrorHandler);

app.listen(port, () => console.log("server running on " + port + " port"));
