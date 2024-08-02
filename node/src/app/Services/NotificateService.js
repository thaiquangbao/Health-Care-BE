const cron = require("node-cron");
const moment = require("moment-timezone");
const mailService = require("../Services/MailerService"); // Giả sử bạn có một dịch vụ gửi mail
const appointmentService = require("./AppointmentService/AppointmentService");
const appointmentModel = require("../models/appointmentModels");
const doctorRecordModel = require("../models/doctorRecordModel");
class ScheduleEmailNotification {
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
      .subtract(1, "hour"); // Trừ 1 tiếng
    if (
      now.isBetween(notificationDate, appointmentDate) &&
      !appointment.notificationSent
    ) {
      const doctorRecord = await doctorRecordModel.findById(
        appointment.doctor_record_id
      );
      await mailService.sendMail(
        appointment.patient.email,
        `Xin chào ${appointment.patient.fullName}`,
        "test",
        `Bạn còn 1 tiếng nữa là đến cuộc hẹn với bác sĩ ${doctorRecord.doctor.fullName} \n` +
          `Vào lúc ${appointment.appointment_date.time}`
      );
      await mailService.sendMail(
        doctorRecord.doctor?.email,
        `Xin chào bác sĩ ${doctorRecord.doctor?.fullName}`,
        "test",
        `Bác sĩ còn 1 tiếng nữa là đến cuộc hẹn với bệnh nhân ${doctorRecord.doctor.fullName} \n` +
          `Vào lúc ${appointment.appointment_date.time}`
      );
      await appointmentModel.findByIdAndUpdate(
        appointment._id,
        { notificationSent: true },
        { new: true }
      );
      console.log(
        `Notification sent to ${
          appointment.patient.email
        } for appointment at ${appointmentDate.format()}`
      );
    } else {
      console.log("Không có lịch hẹn nào cần thông báo");
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
        console.log("Đã checked lịch hẹn");
      } catch (error) {
        console.error(
          "Error fetching depointments:",
          error
        );
      }
    });
  }
}

module.exports = new ScheduleEmailNotification();
