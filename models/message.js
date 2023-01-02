const mongoose = require("mongoose");

const message = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    sender: {
      id: mongoose.Types.ObjectId,
      userName: String,
    },
    receiver: {
      id: mongoose.Types.ObjectId,
      userName: String,
    },
    text: {
      type: String,
      required: true,
    },
    date_time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("message", message);
