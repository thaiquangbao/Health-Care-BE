const userModel = require("../../models/usersModels");
const passWordUntil = require("../../../untill/PassWordUntills");
const doctorResponse = require("../../Dtos/Doctors/DoctorResponse");
const doctorRequest = require("../../Dtos/Doctors/DoctorRequest");
const doctorRecordService = require("../AppointmentService/DoctorRecordService");
const uploadToS3 = require("../../../config/AWS/S3");
class DoctorService {
  async createDoctor(dataDoctor) {
    const existDoctor = await userModel.findOne({
      phone: dataDoctor.phone,
    });
    if (existDoctor) {
      return 0;
    }
    const passWord = await passWordUntil.hashPassword(
      dataDoctor.passWord
    );
    dataDoctor.role = "DOCTOR";
    dataDoctor.processSignup = 3;
    dataDoctor.image =
      "https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0";
    const newDoctor = new userModel({
      ...dataDoctor,
      passWord,
    });
    const saved = await newDoctor.save();
    const savedDoctorRecord =
      await doctorRecordService.save({
        doctor: doctorRequest.toDoctorRecord(saved),
      });
    if (!savedDoctorRecord) {
      return "Tạo hồ sơ bác sĩ không thành công";
    }
    return await doctorResponse.toDoctorAuth(newDoctor);
  }
  async updateDoctor(dataDoctor) {
    const existDoctor = await userModel.findOne({
      $and: [{ _id: dataDoctor._id }, { role: "DOCTOR" }],
    });

    if (!existDoctor) {
      return 0;
    }
    const existPhone = await userModel.findOne({
      phone: dataDoctor.phone,
      _id: { $ne: existDoctor._id },
    });
    if (existPhone) {
      return 2;
    }
    existDoctor.role = "DOCTOR";
    const updated = await userModel.findByIdAndUpdate(
      existDoctor._id,
      dataDoctor,
      { new: true }
    );
    const updateRecord =
      await doctorRecordService.updateDoctor(
        doctorRequest.toDoctorRecord(updated)
      );
    if (!updateRecord) {
      return "Cập nhật hồ sơ bác sĩ không thành công";
    }
    return await doctorResponse.toDoctorAuth(updated);
  }
  async getAllDoctor() {
    const doctors = await userModel.find({
      role: "DOCTOR",
    });
    const ls = doctors.map((item) => {
      const doctorAuth = doctorResponse.toDoctorAuth(item);
      return doctorAuth;
    });
    return ls;
  }
  async getDoctorById(data) {
    const doctor = await userModel.findOne({
      $and: [{ _id: data._id }, { role: "DOCTOR" }],
    });
    if (!doctor) {
      return 0;
    }
    const userAuth = await doctorResponse.toDoctorAuth(
      doctor
    );
    return userAuth;
  }
  async deleteDoctor(data) {
    const doctor = await userModel.findOneAndDelete({
      $and: [{ _id: data.id }, { role: "DOCTOR" }],
    });

    if (!doctor) {
      return 0;
    }
    const doctorRecord =
      await doctorRecordService.deleteOne(data.id);
    if (doctorRecord != 1) {
      return 2;
    }
    return 1;
  }
  async deleteManyDoctor(data) {
    const doctor = await userModel.deleteMany({
      $and: [
        { _id: { $in: data.ids } },
        { role: "DOCTOR" },
      ],
    });
    console.log(doctor);
    return 1;
  }
  async updatePassWord(data, id) {
    const existDoctor = await userModel.findOne({
      $and: [{ _id: id }, { role: "DOCTOR" }],
    });
    if (!existDoctor) {
      return 0;
    }
    const checkPassWord =
      await passWordUntil.comparePasswords(
        data.oldPassWord,
        existDoctor.passWord
      );
    if (!checkPassWord) {
      return 2;
    }
    const hashedPassWord = await passWordUntil.hashPassword(
      data.newPassWord
    );
    const updated = await userModel.findByIdAndUpdate(
      existDoctor._id,
      { passWord: hashedPassWord },
      { new: true }
    );
    return await doctorResponse.toDoctorAuth(updated);
  }
  async takePassWord(data) {
    const existDoctor = await userModel.findOne({
      $and: [{ phone: data.phone }, { role: "DOCTOR" }],
    });
    if (!existDoctor) {
      return 0;
    }
    const hashedPassWord = await passWordUntil.hashPassword(
      data.newPassWord
    );
    const updated = await userModel.findByIdAndUpdate(
      existDoctor._id,
      { passWord: hashedPassWord },
      { new: true }
    );
    return await doctorResponse.toDoctorAuth(updated);
  }
  async updateImage(data, image) {
    const existDoctor = await userModel.findOne({
      $and: [{ _id: data._id }, { role: "DOCTOR" }],
    });
    if (!existDoctor) {
      return 0;
    }
    const url = await uploadToS3(
      `image_${Date.now().toString()}_${
        image.originalname.split(".")[0]
      }`,
      image.buffer,
      image.mimetype
    );
    image = url.url;
    const updated = await userModel.findByIdAndUpdate(
      existDoctor._id,
      { image: image },
      { new: true }
    );
    await doctorRecordService.updateImgDoctor(
      existDoctor._id,
      image
    );
    return await doctorResponse.toDoctorAuth(updated);
  }
  async updateEmail(dataDoctor){
    const existDoctor = await userModel.findOne({
      $and: [{ _id: dataDoctor._id }, { role: "DOCTOR" }],
    });

    if (!existDoctor) {
      return 0;
    }
    const existEmail = await userModel.findOne({ email: dataDoctor.email, _id: { $ne: existDoctor._id }, });
    if (existEmail) {
      return 2;
    }
    existDoctor.role = "DOCTOR";
    const updated = await userModel.findByIdAndUpdate(
      existDoctor._id,
      { $set: 
        {
          email: dataDoctor.email
        }  
      },
      { new: true }
    );
    const updateRecord =
      await doctorRecordService.updateDoctor(
        doctorRequest.toDoctorRecord(updated)
      );
    if (!updateRecord) {
      return "Cập nhật hồ sơ bác sĩ không thành công";
    }
    return await doctorResponse.toDoctorAuth(updated);
  }
}
module.exports = new DoctorService();
