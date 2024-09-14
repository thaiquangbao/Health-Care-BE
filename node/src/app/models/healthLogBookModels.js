const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const healthLogBooks = new Schema({
  doctor: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    image: { type: String, default: "" },
    specialize: { type: String, default: "" },
    email: { type: String, default: "" },
  },
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
    dateOfBirth: { type: String, default: "" },
  },
  priceList: {
    type: { type: String, default: "" },
    price: { type: Number, default: 0 },
  },
  date: {
    day: Number,
    month: Number,
    year: Number,
    time: String,
  },
  reExaminationDates: {
    type: [
      {
        _id: false,
        day: Number,
        month: Number,
        year: Number,
        time: String,
      },
    ],
    default: [],
  },
  disMon: {
    type: [
      {
        _id: false,
        symptom: { type: String, default: "" },
        vitalSign: {
          temperature: { type: Number, default: 0 },
          bloodPressure: { type: String, default: "" },
          heartRate: { type: Number, default: 0 },
          height: { type: Number, default: 0 },
          weight: { type: Number, default: 0 },
        },
        date: {
          day: Number,
          month: Number,
          year: Number,
          time: String,
        },
        note: { type: String, default: "" },
      },
    ],
    default: [],
  },
  status_heartRate: {
    type: {
      _id: false,
      status_type: String,
      message: String,
    },
    default: null,
  },
  status_bmi: {
    type: {
      _id: false,
      status_type: String,
      message: String,
    },
    default: null,
  },
  status_bloodPressure: {
    type: {
      _id: false,
      status_type: String,
      message: String,
    },
    default: null,
  },
  status_temperature: {
    type: {
      _id: false,
      status_type: String,
      message: String,
    },
    default: null,
  },
  status: {
    type: {
      _id: false,
      status_type: String,
      message: String,
    },
    default: { status_type: "", message: "" },
  },
  dateStop: {
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    time: { type: String, default: "" },
  },
});
module.exports = mongoose.model(
  "healthLogBooks",
  healthLogBooks
);
