const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const customers = new Schema(
  {
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    sex: { type: Boolean, default: false },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    cccd: { type: String, default: "" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("customers ", customers);
