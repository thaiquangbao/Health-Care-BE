const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const forums = new Schema({
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  category: { type: String, default: "" },
  views: { type: Number, default: 0 },
  author: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  date: {
    day: Number,
    month: Number,
    year: Number,
  },
  like: { type: [String], default: [] },
});
module.exports = mongoose.model("forums", forums);
