const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const payBacks = new Schema({
  doctor_id: { type: Schema.Types.ObjectId },
  type: { type: String, default: "" },
  service_id: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  status: {
    type: { type: String, default: "" },
    messages: { type: String, default: "" },
  },
  price: { type: Number, default: 0 },
  date: {
    time: { type: String, default: "" },
    day: { type: Number, default: 0 },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
  },
  reason: { type: String, default: "" },
});
module.exports = mongoose.model("payBacks", payBacks);
