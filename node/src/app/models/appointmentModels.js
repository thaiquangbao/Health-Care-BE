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
      image: {
        type: String,
        default:
          "https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0",
      },
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
    price_list: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    sick: { type: String, default: "" },
    notificationSent: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    healthRate: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    temperature: { type: Number, default: 0 },
    bloodPressure: { type: String, default: "" },
    reason: { type: String, default: "" },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "appointments",
  appointments
);
