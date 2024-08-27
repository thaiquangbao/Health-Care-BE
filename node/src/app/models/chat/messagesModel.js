const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const messages = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    messages: {
      type:[
        {
          _id: false,
          content: String,
          time: {
            day: Number,
            month: Number,
            year: Number,
            time: String,
          },
          author: { type: String, default: "SYSTEM" },
          type: { type: String, default: "TEXT" },
          vitals: {
            temperature: { type: Number, default: 0 },
            bloodPressure: { type: String, default: "" },
            heartRate: { type: Number, default: 0 },
            weight: { type: Number, default: 0 },
            height: { type: Number, default: 0 },
          },
        }
      ]
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("messages", messages);
