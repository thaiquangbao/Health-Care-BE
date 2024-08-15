const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const assessments = new Schema({
  doctor_record_id: { type: Schema.Types.ObjectId },
  assessment_list: {
    _id: false,
    content: { type: String, default: "" },
    star: { type: Number, default: 0 },
    image: { type: String, default: "" },
    fullName: { type: String, default: "" },
    date: {
      day: Number,
      month: Number,
      year: Number,
    },
  },
});
module.exports = mongoose.model("assessments", assessments);
