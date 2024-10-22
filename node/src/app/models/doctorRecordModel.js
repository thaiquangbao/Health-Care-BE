const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const doctorRecords = new Schema(
  {
    doctor: {
      _id: { type: Schema.Types.ObjectId },
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      sex: { type: Boolean, default: false },
      phone: { type: String, default: "" },
      image: { type: String, default: "" },
      specialize: { type: String, default: "" },
      pathological: { type: String, default: "" },
    },
    examination_call: { type: Number, default: 0 },
    consultation: { type: Number, default: 0 },
    assessment: { type: Number, default: 0 },
    experience_work: { type: String, default: "" },
    trainingPlace: { type: String, default: "" },
    certificate: { type: [String], default: [] },
    language: { type: [String], default: [] },
    area: { type: String, default: "" },
    description: { type: String, default: "" },
    motivate: { type: String, default: "" },
    schedules: {
      type: [
        {
          _id: false,
          date: {
            day: Number,
            month: Number,
            year: Number,
            time: String,
          },
          times: {
            type: [
              {
                _id: false,
                time: String,
                status: String,
                price: Number,
              },
            ],
          },
        },
      ],
      default: [],
    },
  },
 
  { timestamps: true }
);
module.exports = mongoose.model(
  "doctorRecords",
  doctorRecords
);
