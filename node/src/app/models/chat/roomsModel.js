const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const rooms = new Schema(
  {
    lastMessages: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      content: {
        type: String,
        default: "Start messaging now !!!",
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
      },
      time: {
        type: Date,
        default: () => moment().toDate(),
      },
    },
    image: {
      type: String,
      default: "",
    },
    creator: Schema.Types.ObjectId,
    recipient: Schema.Types.ObjectId,
    name: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("rooms ", rooms);
