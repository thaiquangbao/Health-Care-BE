const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const rooms = new Schema(
  {
    lastMessage: {
      author: {
        type: String, // id of sender
        default: "SYSTEM",
      },
      content: {
        type: String,
        default: "Hãy bắt đầu cuộc trò chuyện !!!",
      },
      time: {
        day: Number,
        month: Number,
        year: Number,
        time: String,
      },
    },
    doctor: {
      _id: { type: Schema.Types.ObjectId },
      fullName: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    patient: {
      _id: { type: Schema.Types.ObjectId },
      fullName: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    status: {type: String, default: "ACTIVE"},
  },
  { timestamps: true }
);
module.exports = mongoose.model("rooms ", rooms);
