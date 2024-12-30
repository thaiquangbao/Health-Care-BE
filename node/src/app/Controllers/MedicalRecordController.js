const medicalRecordService = require("../Services/MedicalRecordService");
class MedicalRecordController {
  async save(req, res) {
    try {
      const medicalRecordData = req.body;
      const rs = await medicalRecordService.save(
        medicalRecordData
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bệnh nhân!!!");
      }
      if (rs === 2) {
        return res
          .status(404)
          .json("Không tìm thấy bác sĩ!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const medicalRecordData = req.body;
      const rs = await medicalRecordService.update(
        medicalRecordData
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bệnh án!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async delete(req, res) {
    try {
      const id = req.params.id;
      const rs = await medicalRecordService.delete(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bệnh án!!!");
      }
      if (rs === 2) {
        return res
          .status(404)
          .json("Xóa hồ sơ bệnh án không thành công!!!");
      }
      return res.status(200).json("Xóa bệnh án thành công");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async deleteMany(req, res) {
    try {
      const data = req.body;
      await medicalRecordService.deleteMany(data);
      return res
        .status(200)
        .json("Xóa các bệnh án thành công");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const rs = await medicalRecordService.getById(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bệnh án!!!");
      }

      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      let rs = await medicalRecordService.getAll();
      rs = JSON.parse(
        JSON.stringify(rs, (key, value) =>
          typeof value === "bigint"
            ? value.toString()
            : value
        )
      );
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async findByPatient(req, res) {
    try {
      const patient = req.params.id;

      const rs = await medicalRecordService.findByPatient(
        patient
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByDoctor(req, res) {
    try {
      const doctor = req.params.id;
      const rs = await medicalRecordService.findByDoctor(
        doctor
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async checkMedicalRecord(req, res) {
    try {
      const data = req.body;
      const rs = await medicalRecordService.checkMedical(
        data
      );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async checkAppointment(req, res) {
    try {
      const data = req.body;
      const rs =
        await medicalRecordService.checkAppointment(
          data.appointment
        );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findByAppointment(req, res) {
    try {
      const id = req.params.id;
      const rs = await medicalRecordService.findByAppointment(id);
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
module.exports = new MedicalRecordController();
