import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: "senderModel",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      refPath: "receiverModel",
      required: true,
    },
    senderModel: { type: String, enum: ["User", "Gym"], required: true },
    receiverModel: { type: String, enum: ["User", "Gym"], required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);
