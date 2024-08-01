const doctorRecordModel = require("../../models/doctorRecordModel");
class DoctorRecordService {
  async save(doctorRecordData) {
    try {
      const doctorRecord = new doctorRecordModel({
        doctor: doctorRecordData.doctor,
      });
      await doctorRecord.save();
      return doctorRecord;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.log(error);
      throw error;
    }
  }
  async getOne(id) {
    try {
      const rs = await doctorRecordModel
        .findOne({ "doctor._id": id })
        .lean();
      if (!rs) {
        return 0;
      }
      return rs;
    } catch (error) {
      throw error;
    }
  }
  async updateOne(doctorRecordData) {
    try {
      // Lưu instance vào cơ sở dữ liệu
      const checkData = await doctorRecordModel.findById(
        doctorRecordData._id
      );
      if (!checkData) {
        return 0;
      }
      const rs = await doctorRecordModel.findByIdAndUpdate(
        checkData._id,
        doctorRecordData,
        { new: true }
      );
      return rs;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.log(error);
      throw error;
    }
  }
  async updateDoctor(dataUser) {
    const update = await doctorRecordModel.findOneAndUpdate(
      {
        "doctor._id": dataUser._id,
      },
      { $set: { doctor: dataUser } },
      { new: true }
    );
    return update;
  }
  async getAll() {
    try {
      const rs = await doctorRecordModel.find().lean();

      return rs;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async deleteOne(id) {
    try {
      const checkData = await doctorRecordModel.findById(
        id
      );
      if (!checkData) {
        return 0;
      }
      await doctorRecordModel.findByIdAndDelete(
        checkData._id
      );
      return 1;
    } catch (error) {
      throw error;
    }
  }
  async deleteAll(idses) {
    try {
      const ids = idses.ids;
      await doctorRecordModel.deleteMany({
        _id: { $in: ids },
      });
      return 1;
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new DoctorRecordService();
