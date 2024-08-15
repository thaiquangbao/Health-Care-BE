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
  },
  doctor: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  totalDiagnosisDisease: { type: [String], default: [] },
  totalSymptoms: { type: [String], default: [] },
  vitalSigns: {
    type: [
      {
        _id: false,
        temperature: { type: Number, default: 0 },
        bloodPressure: { type: Number, default: 0 },
        heartRate: { type: Number, default: 0 },
        respiratoryRate: { type: Number, default: 0 },
      },
    ],
    default: [],
  },
  medicalExaminationHistory: {
    type: [
      {
        _id: false,
        diagnosisDisease: { type: String, default: "" },
        symptoms: { type: String, default: "" },
        date: {
          day: Number,
          month: Number,
          year: Number,
          time: String,
        },
        note: { type: String, default: "" },
        medical: {
          type: [
            {
              _id: false,
              medicalName: { type: String, default: "" },
              quantity: { type: Number, default: 0 },
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },
  reExaminationDate: {
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
  },
});
module.exports = mongoose.model(
  "medicalRecords",
  medicalRecords
);
