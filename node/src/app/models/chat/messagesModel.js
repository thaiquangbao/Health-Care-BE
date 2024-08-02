const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const messages = new Schema(
  {
    content: String,
    author: Schema.Types.ObjectId,
    room_id: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    reply: {
      _id: {
        type: Schema.Types.ObjectId,
        default: null,
      },
      content: {
        type: String,
        default: "",
      },
    },
    emoji: { type: String, default: "" },
    disabled: {
      type: Boolean,
      default: false,
    },
    typeMessage: {
      type: String,
      enum: ["text", "image", "video", "voice", "file"],
      required: true,
      default: "text",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("messages", messages);
