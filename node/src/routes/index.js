const appointmentRoute = require("./appointment/appointmentRoute");
const doctorRecordRoute = require("./doctorRecords/doctorRecordRoute");
const authRoute = require("./auth/authRoute");
function routes(app) {
  app.use("/doctorRecords", doctorRecordRoute);
  app.use("/appointments", appointmentRoute);
  app.use("/auth", authRoute);
}
module.exports = routes;
