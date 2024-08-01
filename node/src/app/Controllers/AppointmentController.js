const mailService = require("../Services/MailerService");
const appointmentService = require("../Services/AppointmentService/AppointmentService");
class AppointmentController {
  async save(req, res) {
    try {
      const appointmentData = req.body;
      const rs = await appointmentService.save(
        appointmentData
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ!!!");
      }
      if (rs === 2) {
        return res
          .status(404)
          .json("Không tìm thấy người dùng!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async updateAppointment(req, res) {
    try {
      const rs = await appointmentService.updateOne(
        req.body
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByRecordAndStatus(req, res) {
    try {
      const dataSearch = req.body;
      const rs =
        await appointmentService.findByRecordAndStatus(
          dataSearch
        );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByDate(req, res) {
    try {
      const dataSearch = req.body;
      const rs = await appointmentService.findByDate(
        dataSearch
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByRecords(req, res) {
    try {
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      const rs = await appointmentService.findByRecord(
        req.body
      );
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await appointmentService.getAll();
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async sendMail(req, res) {
    try {
      const data = req.body;
      const rs = await mailService.sendMail(
        data.receiver,
        data.subject,
        data.text,
        data.body
      );
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
module.exports = new AppointmentController();
