const moment = require("moment-timezone");
const doctorRecordService = require("../Services/AppointmentService/DoctorRecordService");
class TestController {
  async testTime(req, res) {
    try {
      const data = req.body;
      const rs = await doctorRecordService.removeSchedule(data);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }

   
  }
}
module.exports = new TestController();