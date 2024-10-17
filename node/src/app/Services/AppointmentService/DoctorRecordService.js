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
  async updateImgDoctor(doctor_id, image) {
    const update = await doctorRecordModel.findOneAndUpdate(
      {
        "doctor._id": doctor_id,
      },
      { $set: { "doctor.image": image } },
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
      const checkData = await doctorRecordModel.findOne({
        "doctor._id": id,
      });
      if (!checkData) {
        console.log("Không tìm thấy hồ sơ bác sĩ");
        return "Không tìm thấy hồ sơ bác sĩ";
      }
      await doctorRecordModel.findOneAndDelete({
        "doctor._id": checkData.doctor._id,
      });
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
  async getById(id) {
    const rs = await doctorRecordModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async removeSchedule(data) {
   const exist = await doctorRecordModel.findById(data.doctor_record_id);
    if (!exist) {
      return 0;
    }
    let schedule = exist.schedules;
    for (let i = 0; i < schedule.length; i++) {
      const scheduleItem = exist.schedules[i];
      const date = scheduleItem.date;
      if (date.day === data.date.day && date.month === data.date.month && date.year === data.date.year) {
        for (let j = 0; j < scheduleItem.times.length; j++) {
          const timeItem = scheduleItem.times[j];
          if(timeItem.time === data.time && timeItem.status === 'home') {
             scheduleItem.times.pull(timeItem);
          }
        }
        
      }
    }
    const rs = await doctorRecordModel.findByIdAndUpdate(data.doctor_record_id, exist, { new: true });
    return rs;
  }
  async checkSchedule(data) {
    const exist = await doctorRecordModel.findById(data.doctor_record_id);
    if (!exist) {
      return 0;
    }
    let result = false;
    let schedule = exist.schedules;
    for (let i = 0; i < schedule.length; i++) {
      const scheduleItem = exist.schedules[i];
      const date = scheduleItem.date;
      if (date.day === data.date.day && date.month === data.date.month && date.year === data.date.year) {
        for (let j = 0; j < scheduleItem.times.length; j++) {
          const timeItem = scheduleItem.times[j];
          if(timeItem.time === data.time && timeItem.status === 'home') {
            result = true;
            return result;
          }
        
        }
        
      }
    }
    // const rs = await doctorRecordModel.findByIdAndUpdate(data.doctor_record_id, exist, { new: true });
    return result;
  }
}
module.exports = new DoctorRecordService();
