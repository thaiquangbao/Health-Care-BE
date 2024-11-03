const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const payments = new Schema({
  patient_id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  doctor_id: { type: Schema.Types.ObjectId, default: null },
  category: { type: String, default: "" },
  namePayment: { type: String, default: "" },
  date: {
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    time: { type: String, default: "" },
  },
  dateTake: {
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    time: { type: String, default: "" },
  },
  beneficiaryAccount: {
    accountNumber: { type: String, default: "0834885704" },
    bankName: { type: String, default: "MB" },
    accountName: { type: String, default: "THAI ANH THU" },
  },
  status_payment: {
    type: { type: String, default: "" },
    messages: { type: String, default: "" },
  },
  status_take_money: {
    type: { type: String, default: "" },
    messages: { type: String, default: "" },
  },
  price: { type: Number, default: 0 },
  description: { type: String, default: "" },
  descriptionTake: { type: String, default: "" },
});
module.exports = mongoose.model("payments", payments);
