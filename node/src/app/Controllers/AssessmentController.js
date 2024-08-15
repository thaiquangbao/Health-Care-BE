const assessmentService = require("../Services/AssessmentService");

class AssessmentController {
  async create(req, res) {
    try {
      const data = req.body;
      const rs = await assessmentService.create(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ!!!");
      }
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const rs = await assessmentService.getOne(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy đánh giá!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await assessmentService.getAll();
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getByDoctorRecordId(req, res) {
    try {
      const doctor_record_id = req.params.id;
      const rs =
        await assessmentService.getByDoctorRecordId(
          doctor_record_id
        );
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json;
    }
  }
}
module.exports = new AssessmentController();
