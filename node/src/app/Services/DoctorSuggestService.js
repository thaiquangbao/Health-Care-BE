const doctorSuggestModel = require("../models/doctorSuggestModels");
class DoctorSuggestService {
  save = async (data) => {
    return await doctorSuggestModel.create(data);
  };
  findAll = async () => {
    return await doctorSuggestModel.find();
  };
  remove = async (doctor_record_id) => {
    const exist = await doctorSuggestModel.findOne({
      doctor_record_id: doctor_record_id,
    });
    if (!exist) {
      return 0;
    }
    return await doctorSuggestModel.findOneAndDelete({
      doctor_record_id: doctor_record_id,
    });
  };
  findById = async (doctor_record_id) => {
    return await doctorSuggestModel.findOne({
      doctor_record_id: doctor_record_id,
    });
  };
  update = async (data) => {
    const exist = await doctorSuggestModel.findOne({
      doctor_record_id: data._id,
    });
    if (!exist) {
      return 0;
    }
    return await doctorSuggestModel.findOneAndUpdate(
      { doctor_record_id: exist.doctor_record_id },
      { doctor_record_id: data.doctor_record_id },
      { new: true }
    );
  };
}
module.exports = new DoctorSuggestService();
