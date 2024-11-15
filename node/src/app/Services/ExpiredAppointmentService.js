const cron = require("node-cron");
const moment = require("moment-timezone");
const mailService = require("../Services/MailerService"); // Giả sử bạn có một dịch vụ gửi mail
const appointmentService = require("./AppointmentService/AppointmentService");
const appointmentModel = require("../models/appointmentModels");
const doctorRecordModel = require("../models/doctorRecordModel");
const noticeService = require("../Services/NoticeService");
const payBackService = require("../Services/PayBackService");
class ExpiredAppointmentService {
  async notification(appointment) {
    const [hours, minutes] =
      appointment.appointment_date.time
        .split(":")
        .map(Number);
    const appointmentDate = moment.tz(
      {
        year: appointment.appointment_date.year,
        month: appointment.appointment_date.month - 1,
        day: appointment.appointment_date.day,
        hour: hours,
        minute: minutes,
      },
      "Asia/Ho_Chi_Minh"
    );
    const now = moment.tz("Asia/Ho_Chi_Minh");
    const notificationDate = appointmentDate
      .clone()
      .add(30, "minutes"); // cộng 30 phút
    if (now.isSameOrAfter(notificationDate)) {
      const doctorRecord = await doctorRecordModel.findById(
        appointment.doctor_record_id
      );
      let category_sick = "";
      let sex = "";
      let category = "";
      if (!appointment.sick) {
        category_sick = "Tim mạch";
      } else {
        category_sick = appointment.sick;
      }
      if (!appointment.patient.sex) {
        sex = "Nữ";
      } else {
        sex = "Nam";
      }
      if (appointment.price_list.type === "Online") {
        category = "Tư vấn online";
      } else {
        category = "Tư vấn trực tiếp";
      }
      const dataPayback = {
        doctor_id: doctorRecord.doctor._id,
        type: "APPOINTMENT",
        service_id: appointment._id,
        status: {
          type: "AVAILABLE",
          messages: "Khả dụng",
        },
        price: 140000,
        date: appointment.appointment_date,
      };
      await payBackService.save(dataPayback);

      const dataComplete = {
        _id: appointment._id,
        status: "COMPLETED",
        status_message: "Đã hoàn tất lịch hẹn",
      };
      await mailService.sendMail(
        appointment.patient.email,
        "Lịch hẹn khám trực tuyến đã hoàn tất",
        "",
        `Lịch hẹn khám trực tuyến của bạn với BS. ${doctorRecord.doctor.fullName} vào lúc (${appointment.appointment_date.time}) ngày ${appointment.appointment_date.day}/${appointment.appointment_date.month}/${appointment.appointment_date.year} đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ tại Health-heaven!!! <br>
    `
      );
      await mailService.sendMail(
        doctorRecord.doctor.email,
        "Lịch hẹn khám trực tuyến đã hoàn tất",
        "",
        `Lịch hẹn khám trực tuyến của bác sĩ với bệnh nhân ${appointment.patient.fullName} vào lúc (${appointment.appointment_date.time}) ngày ${appointment.appointment_date.day}/${appointment.appointment_date.month}/${appointment.appointment_date.year} đã hoàn tất!!! <br>
    `
      );
      await appointmentService.doctorComplete(dataComplete);
      // Cập nhật số lần khám của bác sĩ
      await doctorRecordModel.findByIdAndUpdate(
        doctorRecord._id,
        {
          examination_call:
            doctorRecord.examination_call + 1,
        },
        { new: true }
      );
      const messagePatient = {
        title: "Lịch hẹn hoàn tất",
        content: `Lịch hẹn khám của bạn với bác sĩ ${doctorRecord.doctor.fullName}. Vào lúc ${appointment.appointment_date.time} đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!!!`,
        category: "APPOINTMENT",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: appointment._id,
        user: appointment.patient._id,
      };
      const messageDoctor = {
        title: "Lịch hẹn hoàn tất",
        content: `Lịch hẹn khám của bác sĩ với bệnh nhân ${appointment.patient.fullName}.Vào lúc ${appointment.appointment_date.time} đã hoàn tất !!!`,
        category: "APPOINTMENT",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: appointment._id,
        user: doctorRecord.doctor._id,
      };
      await noticeService.create(messagePatient);
      await noticeService.create(messageDoctor);

      console.log(
        `Notification sent to ${
          appointment.patient.email
        } and ${
          doctorRecord.doctor?.email
        }for appointment completed at ${appointmentDate.format()}`
      );
    } else {
      console.log(
        "Không có lịch hẹn nào cần thông báo đã hoàn thành"
      );
    }
  }
  async startDepointmentFetch() {
    cron.schedule("*/5 * * * *", async () => {
      try {
        const appointments =
          await appointmentService.getAll();
        const acceptedAppointments = appointments.filter(
          (appointment) => appointment.status === "ACCEPTED"
        );
        for (const appointment of acceptedAppointments) {
          this.notification(appointment);
        }
      } catch (error) {
        console.error(
          "Error fetching depointments:",
          error
        );
      }
    });
  }
}

module.exports = new ExpiredAppointmentService();
