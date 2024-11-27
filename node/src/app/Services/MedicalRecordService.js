const medicalRecordModel = require("../models/medicalRecordModels");
const patientService = require("./AuthService/PatientService");
const doctorService = require("./AuthService/DoctorService");
const medicalRecordDto = require("../Dtos/MedicalRecord/MedicalRecordDto");
const smartContract = require("./SmartContractService");
const usersModels = require("../models/usersModels");
class MedicalRecordService {
  async save(medicalRecordData) {
    const data = { _id: medicalRecordData.patient };
    const patient = await usersModels.findOne(data);
    const dataDoctor = { _id: medicalRecordData.doctor };
    const doctor = await doctorService.getDoctorById(dataDoctor);
    if (!patient) {
      return 0;
    }
    if (!doctor) {
      return 2;
    }

    medicalRecordData.patient = medicalRecordDto.toPatient(patient);
    medicalRecordData.doctor = medicalRecordDto.toDoctor(doctor);
    const medicalRecord = new medicalRecordModel(medicalRecordData);
    await medicalRecord.save();

    return medicalRecord;
  }

  async update(medicalRecordData) {
    const exist = await medicalRecordModel.findById(medicalRecordData._id);
    if (!exist) {
      return 0;
    }
    const rs = await medicalRecordModel.findByIdAndUpdate(
      exist._id,
      medicalRecordData,
      { new: true }
    );

    return rs;
  }
  async delete(id) {
    const exist = await medicalRecordModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await medicalRecordModel.findByIdAndDelete(id);
    if (!rs) {
      return 2;
    }
    return 1;
  }
  async deleteMany(data) {
    const rs = await medicalRecordModel.deleteMany({
      _id: { $in: data.ids },
    });
    return rs;
  }
  async getById(id) {
    const rs = await medicalRecordModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async getAll() {
    const rs = await medicalRecordModel.find();
    return rs;
  }
  async findByPatient(patient) {
    const rs = await medicalRecordModel.find({
      "patient._id": patient,
    });
    const result = rs.filter(
      (item) =>
        item.diagnosisDisease &&
        item.diagnosisDisease.trim() !== "" &&
        item.medical.length > 0
    );
    const validData = await Promise.all(
      result.map(async (item) => {
        const check = await smartContract.checkMedicalRecord(
          item.blockChain.hashTX
        );
        return check && check._id === item.id ? item : null; // Chỉ trả về item nếu nó hợp lệ
      })
    );
    return validData.filter((item) => item !== null); // Lọc ra các item hợp lệ
  }
  // async findByPatient(patient) {
  //   const rs = await medicalRecordModel.find({
  //     "patient._id": patient,
  //   });

  //   const result = rs.filter(
  //     (item) =>
  //       item.diagnosisDisease &&
  //       item.diagnosisDisease.trim() !== "" &&
  //       item.medical.length > 0
  //   );
  //   return result;
  // }
  async findByDoctor(doctor) {
    const rs = await medicalRecordModel.find({
      "doctor._id": doctor,
    });
    return rs;
  }

  async checkMedical(medicalRecordData) {
    const exist = await medicalRecordModel.findOne({
      $and: [
        { "patient._id": medicalRecordData.patient },
        { "doctor._id": medicalRecordData.doctor },
      ],
    });
    if (!exist) {
      return 0;
    }
    return exist;
  }
  async checkAppointment(appointment) {
    const exist = await medicalRecordModel.findOne({
      appointment: appointment,
    });
    if (!exist) {
      return 0;
    }
    return exist;
  }
  async updateBlockChain(id, hashTX) {
    const exist = await medicalRecordModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await medicalRecordModel.findByIdAndUpdate(
      exist._id,
      { $set: { "blockChain.hashTX": hashTX } },
      { new: true }
    );
    return rs;
  }
}
module.exports = new MedicalRecordService();
