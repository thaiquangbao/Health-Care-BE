const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const doctorSuggests = new Schema(
  {
    doctor_record_id: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "doctorSuggests",
  doctorSuggests
);
