const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const appointmentHomes = new Schema(
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
      address: { type: String, default: "" },
    },
    appointment_date: {
      day: Number,
      month: Number,
      year: Number,
      time: String,
    },
    status: {
      type: {
        _id: false,
        status_type: String,
        message: String,
      },
      default: { status_type: "", message: "" },
    },
    note: { type: String, default: "" },
    price_list: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    sick: { type: String, default: "" },
    notificationSent: { type: Boolean, default: false },
    processAppointment: { type: Number, default: 0 },
    equipment: {
      thermometer: { type: Boolean, default: false },
      bloodPressureMonitor: {
        type: Boolean,
        default: false,
      },
      heartRateMonitor: { type: Boolean, default: false },
      bloodGlucoseMonitor: {
        type: Boolean,
        default: false,
      },
    },
    timeLimit: { 
      day: {type: Number, default: 0},
      month: {type: Number, default: 0},
      year: {type: Number, default: 0},
      time: {type: String, default: ""},
    },

  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "appointmentHomes",
  appointmentHomes
);
