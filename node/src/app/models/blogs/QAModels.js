const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const qas = new Schema({
  patient: { type: Schema.Types.ObjectId, default: null },
  title: { type: String, default: "" },
  content: { type: String, default: "" },
  category: { type: String, default: "" },
  views: { type: Number, default: 0 },
  image: { type: String, default: "" },
  date: {
    day: Number,
    month: Number,
    year: Number,
  },
  like: { type: Number, default: 0 },
});
module.exports = mongoose.model("qas", qas);
