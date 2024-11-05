const mailService = require("../Services/MailerService");
const appointmentService = require("../Services/AppointmentService/AppointmentService");
const emitter = require("../../config/Emitter/emitter");
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
      if (rs === 3) {
        return res
          .status(404)
          .json("Không tìm thấy danh sách giá!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      // emitter.emit("send-notice.submit", rs);
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
      return res.status(200).json(rs);
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

      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByRecords(req, res) {
    try {
      const rs = await appointmentService.findByRecord(
        req.body
      );
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);

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
  async acceptAppointment(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentService.doctorAccept(
        data
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      if (rs === 2) {
        return res
          .status(409)
          .json(
            "Lịch hẹn đang không trong trạng thái chờ chấp nhận!!!"
          );
      }
      emitter.emit("send-email.accept", rs);
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async denyAppointment(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentService.doctorDeny(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      if (rs === 2) {
        return res
          .status(409)
          .json(
            "Lịch hẹn đang không trong trạng thái chờ từ chối!!!"
          );
      }
      emitter.emit("send-email.deny", rs);
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async cancelAppointment(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentService.doctorCancel(
        data
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      if (rs === 2) {
        return res
          .status(404)
          .json(
            "Lịch hẹn đang trong tình trạng không sẵn sàng để hủy!!!"
          );
      }
      emitter.emit("send-email.cancel", rs);
      return res.status(200).json({
        data: rs.rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async cancelPatientAppointment(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentService.patientCancel(
        data
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      if (rs === 2) {
        return res
          .status(409)
          .json(
            "Lịch hẹn đã được bác sĩ từ chối hoặc đồng ý nên không thể hủy!!!"
          );
      }
      emitter.emit("send-email-patient.cancel", rs);
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async completeAppointment(req, res) {
    try {
      const data = req.body;
      const rs = await appointmentService.doctorComplete(
        data
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      // emitter.emit("send-email.cancel", rs);
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByWeek(req, res) {
    try {
      const data = req.body;
      const rs = await appointmentService.findByWeek(data);
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByMonth(req, res) {
    try {
      const data = req.body;
      const rs = await appointmentService.findByMonth(data);
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByNextMonth(req, res) {
    try {
      const data = req.body;
      const rs = await appointmentService.findByNextMonth(
        data
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const rs = await appointmentService.getOne(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async createAppointmentLogBook(req, res) {
    try {
      const data = req.body;
      const rs =
        await appointmentService.createAppointmentLogBook(
          data
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
      if (rs === 3) {
        return res
          .status(404)
          .json("Không tìm thấy danh sách giá!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      emitter.emit("doctor-appointment-logbook.submit", rs);
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findCountByDate(req, res) {
    try {
      const rs = await appointmentService.findCountByDate(
        req.body
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
module.exports = new AppointmentController();
