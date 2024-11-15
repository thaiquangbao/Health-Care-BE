const appointmentHomeModel = require("../models/appointmentHomeModels");
const doctorRecordModel = require("../models/doctorRecordModel");
const patientService = require("./AuthService/PatientService");
const userRequest = require("../Dtos/Patients/PatientRequest");
const priceListService = require("./AppointmentService/PriceListService");
const appointmentHomeRes = require("../Dtos/AppointmentHome/appointmentHomeRes");
const noticeService = require("./NoticeService");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
class AppointmentHomeService {
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
        userRequest.toPatientAppointmentHome(
          existPatient,
          appointmentData.address
        );
      const appointmentHome = new appointmentHomeModel(
        appointmentData
      );
      appointmentHome.doctor_record_id = existRecord._id;
      await appointmentHome.save();
      const messagePatient = {
        title: "Đặt lịch hẹn khám tại nhà",
        content: `Bạn đã đặt lịch hẹn khám tại nhà thành công với BS. ${existRecord.doctor.fullName}. Hãy chờ bác sĩ xác nhận nhé!!!`,
        category: "APPOINTMENTHOME",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: appointmentHome._id,
        user: appointmentData.patient,
      };
      const messageDoctor = {
        title: "Đặt lịch hẹn khám tại nhà",
        content: `Bác sĩ có lịch đặt hẹn khám tại nhà mới. Bấm vào để xem thông tin chi tiết!!!`,
        category: "APPOINTMENTHOME",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: appointmentHome._id,
        user: existRecord.doctor._id,
      };
      noticeService.create(messagePatient);
      noticeService.create(messageDoctor);

      return appointmentHome;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getOne(id) {
    try {
      const rs = await appointmentHomeModel
        .findById(id)
        .lean();
      return rs;
    } catch (error) {
      throw error;
    }
  }
  async updateOne(appointmentData) {
    try {
      const checkData = await appointmentHomeModel.findById(
        appointmentData._id
      );
      if (!checkData) {
        return 0;
      }
      const rs = await appointmentHomeModel
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
      const rs = await appointmentHomeModel.find().lean();
      const result = await Promise.all(
        rs.map(async (item) => {
          const data = await priceListService.getOne(
            item.price_list
          );
          const doctorRecord =
            await doctorRecordModel.findById(
              item.doctor_record_id
            );
          const dt = appointmentHomeRes.toAppointmentHome(
            item,
            data,
            doctorRecord.doctor
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
      const rs = await appointmentHomeModel
        .find({
          $and: [
            {
              doctor_record_id: dataSearch.doctor_record_id,
            },
            { "status.status_type": dataSearch.status },
          ],
        })
        .lean();
      const result = await Promise.all(
        rs.map(async (item) => {
          const data = await priceListService.getOne(
            item.price_list
          );
          const doctorRecord =
            await doctorRecordModel.findById(
              item.doctor_record_id
            );

          return appointmentHomeRes.toAppointmentHome(
            item,
            data,
            doctorRecord.doctor
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
      const rs = await appointmentHomeModel
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
          const doctorRecord =
            await doctorRecordModel.findById(
              item.doctor_record_id
            );
          return appointmentHomeRes.toAppointmentHome(
            item,
            data,
            doctorRecord.doctor
          );
        })
      );
      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async findByRecord(doctor_record_id) {
    const rs = await appointmentHomeModel
      .find({
        doctor_record_id: doctor_record_id,
      })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  }
  async findByPatient(patient_id) {
    const rs = await appointmentHomeModel
      .find({
        "patient._id": patient_id,
      })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  }
  async doctorAccept(data) {
    const rs = await appointmentHomeModel.findById(
      data._id
    );
    if (!rs) {
      return 0;
    }
    if (rs.status.status_type !== "QUEUE") {
      return 2;
    }
    const recordDoctor = await doctorRecordModel.findById(
      rs.doctor_record_id
    );
    const accept =
      await appointmentHomeModel.findByIdAndUpdate(
        rs._id,
        data,
        { new: true }
      );
    const messagePatient = {
      title: "Xác nhận lịch hẹn khám tại nhà",
      content: `Bác sĩ ${recordDoctor.doctor.fullName} đã xác nhận lịch hẹn khám tại nhà của bạn vào lúc ${data.appointment_date.time} ngày ${data.appointment_date.day}/${data.appointment_date.month}/${data.appointment_date.year}. Hãy tiến hành thanh toán nhé!!!`,
      category: "APPOINTMENTHOME",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: rs._id,
      user: rs.patient._id,
    };
    noticeService.create(messagePatient);
    return accept;
  }
  async doctorDeny(data) {
    const rs = await appointmentHomeModel.findById(
      data._id
    );
    if (!rs) {
      return 0;
    }
    if (rs.status.status_type !== "QUEUE") {
      return 2;
    }
    const reject =
      await appointmentHomeModel.findByIdAndUpdate(
        rs._id,
        data,
        { new: true }
      );
    const recordDoctor = await doctorRecordModel.findById(
      rs.doctor_record_id
    );
    const messagePatient = {
      title: "Từ chối lịch hẹn",
      content: `Bác sĩ ${recordDoctor.doctor.fullName} đã từ chối lịch hẹn khám tại nhà của bạn. Hãy đặt một lịch khám mới nhé!!!`,
      category: "APPOINTMENTHOME",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: rs._id,
      user: rs.patient._id,
    };
    noticeService.create(messagePatient);
    return reject;
  }
  async patientCancel(data) {
    const rs = await appointmentHomeModel.findById(
      data._id
    );
    if (!rs) {
      return 0;
    }
    if (
      rs.status.status_type === "CANCELED" ||
      (rs.status.status_type === "ACCEPTED" &&
        rs.processAppointment === 2)
    ) {
      return 2;
    }

    const cancel =
      await appointmentHomeModel.findByIdAndUpdate(
        rs._id,
        data,
        { new: true }
      );

    return cancel;
  }
  async doctorComplete(data) {
    const rs = await appointmentHomeModel.findById(
      data._id
    );
    if (!rs) {
      return 0;
    }
    const recordDoctor = await doctorRecordModel.findById(
      rs.doctor_record_id
    );
    const complete =
      await appointmentHomeModel.findByIdAndUpdate(
        rs._id,
        data,
        { new: true }
      );
    const messagePatient = {
      title: "Hoàn tất lịch hẹn khám tại nhà",
      content: `Lịch hẹn khám tại nhà với BS.${recordDoctor.doctor.fullName} vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!!!`,
      category: "APPOINTMENTHOME",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: rs._id,
      user: rs.patient._id,
    };
    const messageDoctor = {
      title: "Hoàn tất lịch hẹn khám tại nhà",
      content: `Lịch hẹn khám tại nhà với bệnh nhân ${rs.patient.fullName} vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} đã hoàn tất!!!`,
      category: "APPOINTMENTHOME",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: rs._id,
      user: recordDoctor.doctor._id,
    };
    noticeService.create(messagePatient);
    noticeService.create(messageDoctor);
    return complete;
  }
  async doctorCancel(data) {
    const rs = await appointmentHomeModel.findById(
      data._id
    );
    if (!rs) {
      return 0;
    }
    const recordDoctor = await doctorRecordModel.findById(
      rs.doctor_record_id
    );

    const deleted =
      await appointmentHomeModel.findByIdAndUpdate(
        rs._id,
        data,
        {
          new: true,
        }
      );
    const messagePatient = {
      title: "Hủy lịch hẹn",
      content: `Bác sĩ ${recordDoctor.doctor.fullName} đã hủy lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}. Lý do: ${data.note}`,
      category: "APPOINTMENTHOME",
      date: {
        day: rs.appointment_date.day,
        month: rs.appointment_date.month,
        year: rs.appointment_date.year,
      },
      attached: rs._id,
      user: rs.patient._id,
    };
    noticeService.create(messagePatient);
    return { rs: deleted, note: data.note };
  }
  async paymentPatient(data) {
    const rs = await appointmentHomeModel.findById(
      data._id
    );
    if (!rs) {
      return 0;
    }
    const recordDoctor = await doctorRecordModel.findById(
      rs.doctor_record_id
    );
    const payment =
      await appointmentHomeModel.findByIdAndUpdate(
        rs._id,
        data,
        { new: true }
      );
    const messagePatient = {
      title: "Thanh toán lịch hẹn khám tại nhà thành công",
      content: `Bạn đã thanh toán thành công lịch hẹn khám tại nhà vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} với BS.${recordDoctor.doctor.fullName}. Cảm ơn bạn đã sử dụng dịch vụ!!!`,
      category: "APPOINTMENTHOME",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: rs._id,
      user: rs.patient._id,
    };
    const messageDoctor = {
      title: "Lịch hẹn khám tại nhà",
      content: `Bệnh nhân ${rs.patient.fullName} đã thanh toán lịch hẹn khám tại nhà với bác sĩ vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}. Bác sĩ hãy chăm sóc cho bệnh nhân thiệt tốt nhé!!!`,
      category: "APPOINTMENTHOME",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: rs._id,
      user: recordDoctor.doctor._id,
    };
    noticeService.create(messagePatient);
    noticeService.create(messageDoctor);
    return payment;
  }
  async findByWeek(dataSearch) {
    const startOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .startOf("week")
      .toDate();
    const endOfWeek = moment
      .tz("Asia/Ho_Chi_Minh")
      .endOf("week")
      .toDate();
    const startDay = startOfWeek.getDate() + 2;
    const startMonth = startOfWeek.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const startYear = startOfWeek.getFullYear();

    const endDay = endOfWeek.getDate() + 1;
    const endMonth = endOfWeek.getMonth() + 1;
    const endYear = endOfWeek.getFullYear();
    console.log(startDay, endDay);
    const rs = await appointmentHomeModel.find({
      doctor_record_id: dataSearch.doctor_record_id,
      $or: [
        // Trường hợp trong cùng 1 năm và tháng
        {
          "appointment_date.year": startYear,
          "appointment_date.month": startMonth,
          "appointment_date.day": {
            $gte: startDay,
            $lte: endDay,
          },
        },
        // Trường hợp khác năm hoặc khác tháng (trường hợp tuần kéo dài qua tháng/năm)
        {
          $and: [
            {
              "appointment_date.year": {
                $gte: startYear,
                $lte: endYear,
              },
            },
            {
              $or: [
                {
                  "appointment_date.month": startMonth,
                  "appointment_date.day": {
                    $gte: startDay,
                  },
                },
                {
                  "appointment_date.month": endMonth,
                  "appointment_date.day": {
                    $lte: endDay,
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    const result = await Promise.all(
      rs.map(async (item) => {
        const data = await priceListService.getOne(
          item.price_list
        );
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  }
  async findByMonth(dataSearch) {
    const regex = moment().toDate();
    const rs = await appointmentHomeModel.find({
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
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  }
  async findByNextMonth(dataSearch) {
    const regex = moment().toDate();
    const rs = await appointmentHomeModel.find({
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
        const doctorRecord =
          await doctorRecordModel.findById(
            item.doctor_record_id
          );
        return appointmentHomeRes.toAppointmentHome(
          item,
          data,
          doctorRecord.doctor
        );
      })
    );
    return result;
  }
  async getById(id) {
    const rs = await appointmentHomeModel.findById(id);
    const data = await priceListService.getOne(
      rs.price_list
    );
    const doctorRecord = await doctorRecordModel.findById(
      rs.doctor_record_id
    );
    return appointmentHomeRes.toAppointmentHome(
      rs,
      data,
      doctorRecord.doctor
    );
  }
}
module.exports = new AppointmentHomeService();
