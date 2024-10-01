const cron = require("node-cron");
const moment = require("moment-timezone");
const doctorRecordModel = require("../models/doctorRecordModel");
const noticeService = require("../Services/NoticeService");
const healthLogBookService = require("../Services/HealthLogBookService");
class ScheduleNotification {
  async notificationLogBook(logBook) {
    const messageDoctor = {
      title: "Lịch hẹn khám định kỳ",
      content: `Bác sĩ hãy tạo lịch hẹn khám định kỳ với bệnh nhân ${logBook.patient.fullName} nhé !!!`,
      category: "SCHEDULE",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: logBook._id,
      user: logBook.doctor._id,
    };
    await noticeService.create(messageDoctor);
    console.log(
      `Đã thông báo cho bác sĩ: ${logBook.doctor.fullName} về lịch hẹn khám định kỳ`
    );
  }
  async startWeeklyLogBookFetch() {
    cron.schedule("0 7 * * 1", async () => {
      try {
        const logBooks =
          await healthLogBookService.getAll();
        const acceptedLogBooks = logBooks.filter(
          (appointment) =>
            appointment.status.status_type === "ACCEPTED"
        );

        for (const logBook of acceptedLogBooks) {
          this.notificationLogBook(logBook);
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
module.exports = new ScheduleNotification();
