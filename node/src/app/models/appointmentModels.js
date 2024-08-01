const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const appointments = new Schema(
  {
    doctor_record_id: { type: Schema.Types.ObjectId },
    patient: {
      _id: { type: Schema.Types.ObjectId },
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      sex: { type: Boolean, default: false },
      phone: { type: String, default: "" },
      image: { type: String, default: "" },
    },
    appointment_date: {
      day: Number,
      month: Number,
      year: Number,
      time: String,
    },
    status: String,
    note: String,
    status_message: String,
    price: Number,
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "appointments",
  appointments
);
