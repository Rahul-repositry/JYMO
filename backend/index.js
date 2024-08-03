const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { globalErrorHandler } = require("./controllers/error.controller.js");
const authRoutes = require("./routes/auth.route.js");
const jymAuthRoutes = require("./routes/jymAuth.route.js");
const workoutRoutes = require("./routes/workout.route.js");
const attendanceRoutes = require("./routes/attendance.route.js");
const membershipRoutes = require("./routes/membership.route.js");
const jymoDietRoutes = require("./routes/jymoDiet.route.js");
const cors = require("cors");

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
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/auth/jym", jymAuthRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/membership", membershipRoutes);
app.use("/api/jymoDiet", jymoDietRoutes);
app.use(globalErrorHandler);

app.listen(port, () => console.log("server running on " + port + " port"));
