const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const qas = new Schema({
  patient: { type: Schema.Types.ObjectId, default: null },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  category: { type: [String], default: [] },
  views: { type: Number, default: 0 },
  date: {
    day: Number,
    month: Number,
    year: Number,
  },
  image: { type: [String], default: [] },
  like: { type: [String], default: [] },
  comment: { type: Number, default: 0 },
});
module.exports = mongoose.model("qas", qas);
