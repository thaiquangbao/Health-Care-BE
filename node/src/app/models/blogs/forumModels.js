const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
// const forums = new Schema(
//   {
//     patient: {
//       _id: { type: Schema.Types.ObjectId },
//       fullName: { type: String, default: "" },
//       email: { type: String, default: "" },
//       sex: { type: Boolean, default: false },
//       phone: { type: String, default: "" },
//       image: {
//         type: String,
//         default:
//           "https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0",
//       },
//     },
//     title: { type: String, default: "" },
//     content: { type: String, default: "" },
//     category: { type: String, default: "" },
//     views: { type: Number, default: 0 },
//     reply: {
//       type: [
//         {
//           _id: { type: Schema.Types.ObjectId },
//           content: { type: String, default: "" },
//         },
//       ],
//       default: [],
//     },
//   },
//   { timestamps: true }
// );
// module.exports = mongoose.model("forums", forums);
