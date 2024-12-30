const userModel = require("../../models/usersModels");
const userResponse = require("../../Dtos/Patients/UserResponse");
const passWordUntil = require("../../../untill/PassWordUntills");
const appointmentModel = require("../../models/appointmentModels");
const uploadToS3 = require("../../../config/AWS/S3");
class PatientService {
  async updatePatient(dataPatient) {
    const existPatient = await userModel.findById(
      dataPatient._id
    );
    if (!existPatient) {
      return 0;
    }
    
    dataPatient.role = "USER";
    const existPhone = await userModel.findOne({
      phone: dataPatient.phone,
      _id: { $ne: existPatient._id },
    });
    if (existPhone) {
      return 2;
    }
    const updated = await userModel.findByIdAndUpdate(
      dataPatient._id,
      dataPatient,
      { new: true }
    );
    const patient = await userResponse.toUserAuth(updated);
    return patient;
  }
  async getAllPatient() {
    const patients = await userModel.find({
      role: "USER",
    });
    const ls = await patients.map((item) => {
      const userAuth = userResponse.toUserAuth(item);
      return userAuth;
    });
    return ls;
  }
  async getPatientById(data) {
    const patient = await userModel.findOne({
      $and: [{ _id: data._id }, { role: "USER" }],
    });
    if (!patient) {
      return 0;
    }
    const userAuth = await userResponse.toUserAuth(patient);
    return userAuth;
  }
  async deletePatient(data) {
    const patient = await userModel.findOneAndDelete({
      $and: [{ _id: data.id }, { role: "USER" }],
    });
    if (!patient) {
      return 0;
    }
    return 1;
  }
  async deleteManyPatient(data) {
    const patient = await userModel.deleteMany({
      $and: [{ _id: { $in: data.ids } }, { role: "USER" }],
    });
    console.log(patient);
    return 1;
  }
  async updatePassWord(data, id) {
    const existPatient = await userModel.findOne({
      $and: [{ _id: id }, { role: "USER" }],
    });
    if (!existPatient) {
      return 0;
    }
    const checkPassWord =
      await passWordUntil.comparePasswords(
        data.oldPassWord,
        existPatient.passWord
      );
    if (!checkPassWord) {
      return 2;
    }
    const hashedPassWord = await passWordUntil.hashPassword(
      data.newPassWord
    );
    const updated = await userModel.findByIdAndUpdate(
      existPatient._id,
      { passWord: hashedPassWord },
      { new: true }
    );
    return await userResponse.toUserAuth(updated);
  }
  async takePassWord(data) {
    const existPatient = await userModel.findOne({
      $and: [{ phone: data.phone }, { $or: [{role: "USER"}, {role: "DOCTOR"}] }],
    });
    if (!existPatient) {
      return 0;
    }
    const hashedPassWord = await passWordUntil.hashPassword(
      data.newPassWord
    );
    const updated = await userModel.findByIdAndUpdate(
      existPatient._id,
      { passWord: hashedPassWord },
      { new: true }
    );
    return await userResponse.toUserAuth(updated);
  }
  async updateImage(data, image) {
    const existUSER = await userModel.findOne({
      $and: [{ _id: data._id }, { role: "USER" }],
    });
    if (!existUSER) {
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
      existUSER._id,
      { $set: { image: image } },
      { new: true }
    );
    return await userResponse.toUserAuth(updated);
  }
  async updateEmail(dataPatient){
    const existPatient = await userModel.findById(
      dataPatient._id
    );

    if (!existPatient) {
      return 0;
    }
    const existEmail = await userModel.findOne({ email: dataPatient.email, _id: { $ne: existPatient._id }, });
    if (existEmail) {
      return 2;
    }
    dataPatient.role = "USER";
    const updated = await userModel.findByIdAndUpdate(
      existPatient._id,
      { $set: 
        {
          email: dataPatient.email
        }  
      },
      { new: true }
    );
    const patient = await userResponse.toUserAuth(updated);
    return patient;
  }
}
module.exports = new PatientService();
