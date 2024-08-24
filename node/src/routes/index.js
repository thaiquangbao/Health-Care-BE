const appointmentRoute = require("./appointment/appointmentRoute");
const doctorRecordRoute = require("./doctorRecords/doctorRecordRoute");
const authRoute = require("./auth/authRoute");
const roomRoute = require("./chat/roomRoute");
const messageRoute = require("./chat/messageRoute");
const chatAIRoute = require("./chat/ChatAIRoute");
const priceListRoute = require("./priceList/priceListRoute");
const qaRoute = require("./post/qaRoute");
const sickRoute = require("./sick/sickRoute");
const medicalRecordRoute = require("./medicalRecords/medicalRecordRoute");
const assessmentRoute = require("./assessment/assessmentRoute");
const forumRoute = require("./post/forumRoute");
const imageRoute = require("./upload-image");
const commentRoute = require("./comment/commentRoute");
const noticeRoute = require("./notice/noticeRoute");
function routes(app) {
  app.use("/upload-image", imageRoute);
  app.use("/notices", noticeRoute);
  app.use("/comments", commentRoute);
  app.use("/forums", forumRoute);
  app.use("/assessments", assessmentRoute);
  app.use("/medicalRecords", medicalRecordRoute);
  app.use("/sicks", sickRoute);
  app.use("/qas", qaRoute);
  app.use("/price-lists", priceListRoute);
  app.use("/chats", chatAIRoute);
  app.use("/rooms", roomRoute);
  app.use("/messages", messageRoute);
  app.use("/doctorRecords", doctorRecordRoute);
  app.use("/appointments", appointmentRoute);
  app.use("/auth", authRoute);
}
module.exports = routes;
