const mongoose = require("mongoose");
async function connectAppointment() {
  try {
    mongoose.connect(process.env.MONGO_DB);
    console.log(
      "Connect Appointment-Service thành công !!!"
    );
  } catch (error) {
    console.log("Connect không thành công");
  }
}
module.exports = { connectAppointment };
