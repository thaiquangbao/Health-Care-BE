const appointmentModel = require("../../models/appointmentModels");
const doctorRecordModel = require("../../models/doctorRecordModel");
const patientService = require("../AuthService/PatientService");
const userRequest = require("../../Dtos/Patients/PatientRequest");
const mailService = require("../MailerService");
const priceListService = require("../AppointmentService/PriceListService");
const appointmentRespone = require("../../Dtos/Appoinment/appointmentRes");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
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
      const existPriceList = await priceListService.getOne(
        appointmentData.price_list
      );
      if (!existPriceList) {
        return 3;
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
      const result = await Promise.all(
        rs.map(async (item) => {
          const data = await priceListService.getOne(
            item.price_list
          );

          const dt = appointmentRespone.toAppointment(
            item,
            data
          );
          return dt;
        })
      );

      return result;
    } catch (error) {
      console.log(error);

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
      const result = await Promise.all(
        rs.map(async (item) => {
          const data = await priceListService.getOne(
            item.price_list
          );
          return appointmentRespone.toAppointment(
            item,
            data
          );
        })
      );
      return result;
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
      const result = await Promise.all(
        rs.map(async (item) => {
          const data = await priceListService.getOne(
            item.price_list
          );
          return appointmentRespone.toAppointment(
            item,
            data
          );
        })
      );
      return result;
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
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  }
  async doctorAccept(data) {
    const rs = await appointmentModel.findById(data._id);
    if (!rs) {
      return 0;
    }
    const accept = await appointmentModel.findByIdAndUpdate(
      rs._id,
      data,
      { new: true }
    );
    // const [accept, recordDoctor] = await Promise.all([
    //   appointmentModel.findByIdAndUpdate(rs._id, data, {
    //     new: true,
    //   }),
    //   doctorRecordModel.findById(rs.doctor_record_id),
    // ]);
    // const mail = await mailService.sendMail(
    //   rs.patient.email,
    //   "Xác nhận lịch hẹn",
    //   `Bác sĩ ${recordDoctor.doctor.fullName} đã xác nhận lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}`,
    //   ""
    // );

    // if (!mail) {
    //   return 2;
    // }
    return accept;
  }
  async doctorDeny(data) {
    const rs = await appointmentModel.findById(data._id);
    if (!rs) {
      return 0;
    }
    const reject = await appointmentModel.findByIdAndUpdate(
      rs._id,
      data,
      { new: true }
    );
    // const [reject, recordDoctor] = await Promise.all([
    //   appointmentModel.findByIdAndUpdate(rs._id, data, {
    //     new: true,
    //   }),
    //   doctorRecordModel.findById(rs.doctor_record_id),
    // ]);
    // const mail = await mailService.sendMail(
    //   rs.patient.email,
    //   "Từ chối lịch hẹn",
    //   `Bác sĩ ${recordDoctor.doctor.fullName} đã từ chối lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}`,
    //   ""
    // );
    // if (!mail) {
    //   return 2;
    // }
    return reject;
  }
  async doctorComplete(data) {
    const rs = await appointmentModel.findById(data._id);
    if (!rs) {
      return 0;
    }
    const complete =
      await appointmentModel.findByIdAndUpdate(
        rs._id,
        data,
        { new: true }
      );
    return complete;
  }
  async doctorCancel(data) {
    const rs = await appointmentModel.findById(data._id);
    if (!rs) {
      return 0;
    }
    // const recordDoctor = await doctorRecordModel.findById(
    //   rs.doctor_record_id
    // );
    // const mail = await mailService.sendMail(
    //   rs.patient.email,
    //   "Hủy lịch hẹn",
    //   `Bác sĩ ${recordDoctor.doctor.fullName} đã hủy lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}. Lý do: ${data.note}`,
    //   ""
    // );
    // if (!mail) {
    //   return 2;
    // }
    const deleted =
      await appointmentModel.findByIdAndDelete(rs._id, {
        new: true,
      });
    if (!deleted) {
      return 3;
    }
    return { rs: deleted, note: data.note };
  }
  async findByWeek(dataSearch) {
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();
    const start = startOfWeek.getDate() + 1;
    const end = endOfWeek.getDate() + 1;
    const rs = await appointmentModel
      .find({
        $and: [
          {
            doctor_record_id: dataSearch.doctor_record_id,
          },
          {
            "appointment_date.day": {
              $gte: start,
              $lte: end,
            },
          },
        ],
      })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  }
  async findByMonth(dataSearch) {
    const regex = moment().toDate();
    const rs = await appointmentModel.find({
      $and: [
        {
          doctor_record_id: dataSearch.doctor_record_id,
        },
        {
          "appointment_date.month": regex.getMonth() + 1,
          "appointment_date.year": regex.getFullYear(),
        },
      ],
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  }
  async findByNextMonth(dataSearch) {
    const regex = moment().toDate();
    const rs = await appointmentModel.find({
      $and: [
        {
          doctor_record_id: dataSearch.doctor_record_id,
        },
        {
          "appointment_date.month": regex.getMonth() + 2,
          "appointment_date.year": regex.getFullYear(),
        },
      ],
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        return appointmentRespone.toAppointment(item, data);
      })
    );
    return result;
  }
  async getById(id) {
    const rs = await appointmentModel.findById(id);
    const data = await priceListService.getOne(
      rs.price_list
    );
    return appointmentRespone.toAppointment(rs, data);
  }
}
module.exports = new AppointmentService();
