const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const notifications = new Schema({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  category: { type: String, default: "" },
  date: {
    day: Number,
    month: Number,
    year: Number,
  },
  seen: { type: Boolean, default: false },
  attached: { type: String, default: "" },
  user: { type: Schema.Types.ObjectId, default: null },
});
module.exports = mongoose.model(
  "notifications",
  notifications
);
