const appointmentModel = require("../../models/appointmentModels");
const doctorRecordModel = require("../../models/doctorRecordModel");
const patientService = require("../AuthService/PatientService");
const userRequest = require("../../Dtos/Patients/PatientRequest");
class AppointmentService {
  async save(appointmentData) {
    try {
      const existRecord = await doctorRecordModel.findById(
        appointmentData.doctor_record_id
      );
      if (!existRecord) {
        return 0;
      }
      const data = { _id: appointmentData.patient };
      const existPatient =
        await patientService.getPatientById(data);
      if (!existPatient) {
        return 2;
      }
      appointmentData.patient =
        userRequest.toPatientAppointment(existPatient);
      const appointment = new appointmentModel(
        appointmentData
      );
      appointment.doctor_record_id = existRecord._id;
      await appointment.save();
      return appointment;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getOne(id) {
    try {
      const rs = await appointmentModel.findById(id).lean();
      return rs;
    } catch (error) {
      throw error;
    }
  }
  async updateOne(appointmentData) {
    try {
      const checkData = await appointmentModel.findById(
        appointmentData._id
      );
      if (!checkData) {
        return 0;
      }
      const rs = await appointmentModel
        .findByIdAndUpdate(checkData._id, appointmentData, {
          new: true,
        })
        .lean();
      return rs;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getAll() {
    try {
      const rs = await appointmentModel.find().lean();
      return rs;
    } catch (error) {
      throw error;
    }
  }
  async findByRecordAndStatus(dataSearch) {
    try {
      const rs = await appointmentModel
        .find({
          $and: [
            {
              doctor_record_id: dataSearch.doctor_record_id,
            },
            { status: dataSearch.status },
          ],
        })
        .lean();
      return rs;
    } catch (error) {
      throw error;
    }
  }
  async findByDate(dataSearch) {
    try {
      // Chuyển đổi dữ liệu từ client thành định dạng ISO
      // Tìm kiếm theo ngày
      const rs = await appointmentModel
        .find({
          $and: [
            {
              doctor_record_id: dataSearch.doctor_record_id,
            },
            {
              "appointment_date.day": dataSearch.time.day,
              "appointment_date.month":
                dataSearch.time.month,
              "appointment_date.year": dataSearch.time.year,
            },
          ],
        })
        .lean();
      return rs;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findByRecord(dataSearch) {
    const rs = await appointmentModel
      .find({
        doctor_record_id: dataSearch.doctor_record_id,
      })
      .lean();

    return rs;
  }
}
module.exports = new AppointmentService();
