const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const commentPosts = new Schema({
  text: { type: String, default: "" },
  author: {
    _id: { type: Schema.Types.ObjectId },
    fullName: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  date: {
    day: Number,
    month: Number,
    year: Number,
  },
  image: { type: String, default: "" },
  post: { type: Schema.Types.ObjectId },
});
module.exports = mongoose.model(
  "commentPosts",
  commentPosts
);
