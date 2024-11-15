const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const medicalRecords = new Schema({
  patient: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    sex: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  doctor: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  diagnosisDisease: { type: String, default: "" },
  symptoms: { type: String, default: "" },
  note: { type: String, default: "" },
  medical: {
    type: [
      {
        _id: false,
        medicalName: { type: String, default: "" },
        quantity: { type: Number, default: 0 },
        unitOfCalculation: { type: String, default: "" },
      },
    ],
  },
  date: {
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    time: { type: String, default: "" },
  },
  appointment: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  images: { type: [String], default: [] },
  healthRate: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  temperature: { type: Number, default: 0 },
  bloodPressure: { type: String, default: "" },
  reExaminationDate: {
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
  },
  blockChain: {
    hashTX: { type: String, default: "" },
  },
});
module.exports = mongoose.model(
  "medicalRecords",
  medicalRecords
);
