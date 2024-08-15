const assessmentModel = require("../models/assessmentModels");
const doctorRecordModel = require("../models/doctorRecordModel");
class AssessmentService {
  async create(dataAssessment) {
    const exist = await doctorRecordModel.findById(
      dataAssessment.doctor_record_id
    );
    if (!exist) {
      return 0;
    }
    const assessment = new assessmentModel(dataAssessment);
    return await assessment.save();
  }
  async getOne(id) {
    const rs = await assessmentModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async getAll() {
    return await assessmentModel.find();
  }
  async getByDoctorRecordId(doctor_record_id) {
    return await assessmentModel.find({
      doctor_record_id: doctor_record_id,
    });
  }
}
module.exports = new AssessmentService();
