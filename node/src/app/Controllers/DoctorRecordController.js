const doctorRecordService = require("../Services/AppointmentService/DoctorRecordService");
class DoctorRecordController {
  // index(req, res, next) {
  //   res.send("respond with a resource");
  // }
  async getById(req, res) {
    try {
      const { id } = req.params;
      const rs = await doctorRecordService.getOne(id);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const rs = await doctorRecordService.getById(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async updateDoctorRecord(req, res) {
    try {
      const rs = await doctorRecordService.updateOne(
        req.body
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ này!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getAllDoctorRecord(req, res) {
    try {
      // const accessToken = req.headers["accesstoken"];
      // const refreshToken = req.headers["refreshtoken"];
      // const token = { accessToken, refreshToken };
      const rs = await doctorRecordService.getAll();
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async deleteOneDoctorRecord(req, res) {
    try {
      const { id } = req.params;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      const rs = await doctorRecordService.deleteOne(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ này!!!");
      }
      return res
        .status(200)
        .json({ data: "Xóa record thành công", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async deleteAllDoctorRecord(req, res) {
    try {
      const ids = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      await doctorRecordService.deleteAll(ids);
      return res.status(200).json({
        data: "Xóa các hồ sơ bác sĩ thành công",
        token,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
module.exports = new DoctorRecordController();
