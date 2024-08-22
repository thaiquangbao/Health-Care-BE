const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const commentQAs = new Schema({
  text: { type: String, default: "" },
  author: { type: Schema.Types.ObjectId, default: null },
  date: {
    day: Number,
    month: Number,
    year: Number,
  },
  image: { type: [String], default: [] },
  qa: { type: Schema.Types.ObjectId, default: null },
});
module.exports = mongoose.model("commentQAs", commentQAs);
