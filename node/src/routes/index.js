const appointmentRoute = require("./appointment/appointmentRoute");
const doctorRecordRoute = require("./doctorRecords/doctorRecordRoute");
const authRoute = require("./auth/authRoute");
const roomRoute = require("./chat/roomRoute");
const messageRoute = require("./chat/messageRoute");
const chatAIRoute = require("./chat/ChatAIRoute");
const priceListRoute = require("./priceList/priceListRoute");
const postRoute = require("./post/postRoute");
const sickRoute = require("./sick/sickRoute");
const medicalRecordRoute = require("./medicalRecords/medicalRecordRoute");
const assessmentRoute = require("./assessment/assessmentRoute");
function routes(app) {
  app.use("/assessments", assessmentRoute);
  app.use("/medicalRecords", medicalRecordRoute);
  app.use("/sicks", sickRoute);
  app.use("/posts", postRoute);
  app.use("/price-lists", priceListRoute);
  app.use("/chats", chatAIRoute);
  app.use("/rooms", roomRoute);
  app.use("/messages", messageRoute);
  app.use("/doctorRecords", doctorRecordRoute);
  app.use("/appointments", appointmentRoute);
  app.use("/auth", authRoute);
}
module.exports = routes;
