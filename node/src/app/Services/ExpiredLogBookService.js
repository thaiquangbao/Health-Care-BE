const cron = require("node-cron");
const moment = require("moment-timezone");
const mailService = require("../Services/MailerService");
const healthLogBookService = require("../Services/HealthLogBookService");
const payBackService = require("../Services/PayBackService");
class ExpiredLogBookService {
  async notification(logBooks) {
    try {
      const [hours, minutes] = logBooks.date.time.split(":").map(Number);
      const logBookDate = moment.tz(
        {
          year: logBooks.date.year,
          month: logBooks.date.month - 1,
          day: logBooks.date.day,
          hour: hours,
          minute: minutes,
        },
        "Asia/Ho_Chi_Minh"
      );
      const now = moment.tz("Asia/Ho_Chi_Minh");

      if (logBooks.priceList.price === 1350000) {
        const notificationDate = logBookDate.clone().add(3, "months"); // cộng thêm 3 tháng
        if (now.isSameOrAfter(notificationDate)) {
          const completedData = await healthLogBookService.completed(
            logBooks._id
          );
          const dataPayback = {
            doctor_id: logBooks.doctor._id,
            type: "HEALTHLOGBOOK",
            service_id: logBooks._id,
            status: {
              type: "AVAILABLE",
              messages: "Khả dụng",
            },
            price: 945000,
            date: logBooks.date,
          };
          await payBackService.save(dataPayback);
          await mailService.sendMail(
            completedData.patient.email,
            "Hoàn thành khám lâu dài",
            `Lịch theo giỏi sức khỏe của bạn vào ngày ${completedData.date.day}-${completedData.date.month}-${completedData.date.year} với BS. ${completedData.doctor.fullName} (${completedData.priceList.price}đ/${completedData.priceList.type}) đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!!!`,
            ""
          );
          await mailService.sendMail(
            completedData.doctor.email,
            "Hoàn thành khám lâu dài",
            `Lịch theo giỏi sức khỏe của bác sĩ vào ngày ${completedData.date.day}-${completedData.date.month}-${completedData.date.year} với bệnh nhân ${completedData.patient.fullName} (${completedData.priceList.price}đ/${completedData.priceList.type}) đã hoàn tất!!!`,
            ""
          );

          console.log(
            `Thông báo đến doctor ${completedData.doctor?.email} và ${
              completedData.patient?.email
            } for logbook at ${logBookDate.format()}`
          );
        } else {
          console.log("Không có lịch hẹn 3 tháng nào hết hạn");
        }
      } else if (logBooks.priceList.price === 2300000) {
        const notificationDate6 = logBookDate.clone().add(6, "months"); // cộng thêm 6 tháng
        if (now.isSameOrAfter(notificationDate6)) {
          const completedData = await healthLogBookService.completed(
            logBooks._id
          );
          const dataPayback = {
            doctor_id: logBooks.doctor._id,
            type: "HEALTHLOGBOOK",
            service_id: logBooks._id,
            status: {
              type: "AVAILABLE",
              messages: "Khả dụng",
            },
            price: 1610000,
            date: logBooks.date,
          };
          await payBackService.save(dataPayback);
          await mailService.sendMail(
            completedData.patient.email,
            "Hoàn thành khám lâu dài",
            `Lịch theo giỏi sức khỏe của bạn vào ngày ${completedData.date.day}-${completedData.date.month}-${completedData.date.year} với BS. ${completedData.doctor.fullName} đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!!!`,
            ""
          );
          await mailService.sendMail(
            completedData.doctor.email,
            "Hoàn thành khám lâu dài",
            `Lịch theo giỏi sức khỏe của bác sĩ vào ngày ${completedData.date.day}-${completedData.date.month}-${completedData.date.year} với bệnh nhân ${completedData.patient.fullName} (${completedData.priceList.price}đ/${completedData.priceList.type}) đã hoàn tất!!!`,
            ""
          );
          console.log(
            `Thông báo đến doctor ${completedData.doctor?.email} và ${
              completedData.patient?.email
            } for logbook at ${logBookDate.format()}`
          );
        } else {
          console.log("Không có lịch hẹn 6 tháng nào hết hạn");
        }
      } else {
        const notificationDate12 = logBookDate.clone().add(12, "months"); // cộng thêm 12 tháng
        if (now.isSameOrAfter(notificationDate12)) {
          const completedData = await healthLogBookService.completed(
            logBooks._id
          );
          const dataPayback = {
            doctor_id: logBooks.doctor._id,
            type: "HEALTHLOGBOOK",
            service_id: logBooks._id,
            status: {
              type: "AVAILABLE",
              messages: "Khả dụng",
            },
            price: 2800000,
            date: logBooks.date,
          };
          await payBackService.save(dataPayback);
          await mailService.sendMail(
            completedData.patient.email,
            "Hoàn thành khám lâu dài",
            `Lịch theo giỏi sức khỏe của bạn vào ngày ${completedData.date.day}-${completedData.date.month}-${completedData.date.year} với BS. ${completedData.doctor.fullName} đã hoàn tất. Cảm ơn bạn đã sử dụng dịch vụ!!!`,
            ""
          );
          await mailService.sendMail(
            completedData.doctor.email,
            "Hoàn thành khám lâu dài",
            `Lịch theo giỏi sức khỏe của bác sĩ vào ngày ${completedData.date.day}-${completedData.date.month}-${completedData.date.year} với bệnh nhân ${completedData.patient.fullName} (${completedData.priceList.price}đ/${completedData.priceList.type}) đã hoàn tất!!!`,
            ""
          );
          console.log(
            `Thông báo đến doctor ${completedData.doctor?.email} và ${
              completedData.patient?.email
            } for logbook at ${logBookDate.format()}`
          );
        } else {
          console.log("Không có lịch hẹn 12 tháng nào hết hạn");
        }
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async startLogBookFetch() {
    cron.schedule("*/10 * * * *", async () => {
      try {
        const logBooks = await healthLogBookService.getAll();
        const acceptedLogBooks = logBooks.filter(
          (appointment) => appointment.status.status_type === "ACCEPTED"
        );
        for (const logBooks of acceptedLogBooks) {
          this.notification(logBooks);
        }
      } catch (error) {
        console.error("Error fetching HeartLogBook:", error);
        return error;
      }
    });
  }
}
module.exports = new ExpiredLogBookService();
