const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const priceLists = new Schema({
  type: { type: String, default: "" },
  price: { type: Number, default: 0 },
});
module.exports = mongoose.model("priceLists", priceLists);
