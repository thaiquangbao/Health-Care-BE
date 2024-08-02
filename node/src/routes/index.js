const appointmentRoute = require("./appointment/appointmentRoute");
const doctorRecordRoute = require("./doctorRecords/doctorRecordRoute");
const authRoute = require("./auth/authRoute");
const roomRoute = require("./chat/roomRoute");
const messageRoute = require("./chat/messageRoute");
const chatAIRoute = require("./chat/ChatAIRoute");
function routes(app) {
  app.use("/chats", chatAIRoute);
  app.use("/rooms", roomRoute);
  app.use("/messages", messageRoute);
  app.use("/doctorRecords", doctorRecordRoute);
  app.use("/appointments", appointmentRoute);
  app.use("/auth", authRoute);
}
module.exports = routes;
