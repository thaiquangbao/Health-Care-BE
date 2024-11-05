const mailService = require("../Services/MailerService");
const appointmentHomeService = require("../Services/AppointmentHomeService");
const emitter = require("../../config/Emitter/emitter");
class AppointmentHomeController {
  async save(req, res) {
    try {
      const appointmentHomeData = req.body;
      const rs = await appointmentHomeService.save(
        appointmentHomeData
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
  async getAll(req, res) {
    try {
      const rs = await appointmentHomeService.getAll();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByPatient(req, res) {
    try {
      const rs = await appointmentHomeService.findByPatient(
        req.params.id
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async findByDoctorRecord(req, res) {
    try {
      const rs = await appointmentHomeService.findByRecord(
        req.params.id
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async findByDate(req, res) {
    try {
      const dataSearch = req.body;
      const rs = await appointmentHomeService.findByDate(
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
      const rs = await appointmentHomeService.findByDate(
        dataSearch
      );

      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByWeek(req, res) {
    try {
      const data = req.body;
      const rs = await appointmentHomeService.findByWeek(
        data
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByMonth(req, res) {
    try {
      const data = req.body;
      const rs = await appointmentHomeService.findByMonth(
        data
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByNextMonth(req, res) {
    try {
      const data = req.body;
      const rs =
        await appointmentHomeService.findByNextMonth(data);
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async updateAppointmentHome(req, res) {
    try {
      const rs = await appointmentHomeService.updateOne(
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
  async acceptAppointmentHome(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentHomeService.doctorAccept(
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
            "Lịch hẹn này đang không trong trạng thái chờ xác nhận!!!"
          );
      }
      emitter.emit(
        "send-email-appointment-home.accept",
        rs
      );
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async denyAppointmentHome(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentHomeService.doctorDeny(
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
            "Lịch hẹn này đang không trong trạng thái chờ xác nhận!!!"
          );
      }
      emitter.emit("send-email-appointment-home.deny", rs);
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async cancelAppointmentHome(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentHomeService.doctorCancel(
        data
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      emitter.emit(
        "send-email-appointment-home.cancel",
        rs
      );
      return res.status(200).json({
        data: "Hủy lịch hẹn thành công!!!",
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async patientCancelAppointmentHome(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await appointmentHomeService.patientCancel(
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
            "Lịch hẹn này đang không trong trạng có thể hủy!!!"
          );
      }

      emitter.emit(
        "send-email-appointment-home-patient.cancel",
        rs
      );
      return res.status(200).json({
        data: "Hủy lịch hẹn thành công!!!",
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async completeAppointmentHome(req, res) {
    try {
      const data = req.body;
      const rs =
        await appointmentHomeService.doctorComplete(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      emitter.emit(
        "send-email-appointment-home.complete",
        rs
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async paymentAppointmentHome(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs =
        await appointmentHomeService.paymentPatient(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch hẹn này!!!");
      }
      emitter.emit(
        "send-email-appointment-home.payment",
        rs
      );
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const rs = await appointmentHomeService.getOne(id);
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
  async findByRecordAndStatus(req, res) {
    try {
      const dataSearch = req.body;
      const rs =
        await appointmentHomeService.findByRecordAndStatus(
          dataSearch
        );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
module.exports = new AppointmentHomeController();
