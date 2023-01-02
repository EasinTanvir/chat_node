const mongoose = require("mongoose");

const conversation = new mongoose.Schema(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      userName: String,
    },

    participant: {
      id: mongoose.Types.ObjectId,
      userName: String,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("conversation", conversation);
