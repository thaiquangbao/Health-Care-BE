const mailerService = require("../Services/MailerService");
class MailerController {
  async mailMedicalRecord(req, res) {
    try {
      const data = req.params.id;
      const rs = await mailerService.mailMedicalRecord(data);
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
module.exports = new MailerController();
