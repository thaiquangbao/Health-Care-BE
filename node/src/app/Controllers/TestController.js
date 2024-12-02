const moment = require("moment-timezone");
const doctorRecordService = require("../Services/AppointmentService/DoctorRecordService");
const mailerService = require("../Services/MailerService");
class TestController {
  async testTime(req, res) {
    try {
      const data = req.body;
      const rs = await doctorRecordService.checkSchedule(data);
      console.log(rs);
      
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }

   
  }
  async testMail(req, res) {
    try {
      const data = req.body;
      const rs = await mailerService.sendMail(data.receiver, data.subject, data.text, data.body);
      console.log(rs);
      
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
}
module.exports = new TestController();