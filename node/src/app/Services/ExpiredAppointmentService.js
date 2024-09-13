const cron = require("node-cron");
const moment = require("moment-timezone");
const mailService = require("../Services/MailerService"); // Giả sử bạn có một dịch vụ gửi mail
const appointmentService = require("./AppointmentService/AppointmentService");
const appointmentModel = require("../models/appointmentModels");
const doctorRecordModel = require("../models/doctorRecordModel");
const noticeService = require("../Services/NoticeService");
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
    //   let category_sick = "";
    //   let sex = "";
    //   let category = "";
    //   if (!appointment.sick) {
    //     category_sick = "Tim mạch";
    //   } else {
    //     category_sick = appointment.sick;
    //   }
    //   if (!appointment.patient.sex) {
    //     sex = "Nữ";
    //   } else {
    //     sex = "Nam";
    //   }
    //   if (appointment.price_list.type === "Online") {
    //     category = "Tư vấn online";
    //   } else {
    //     category = "Tư vấn trực tiếp";
    //   }

    //   await mailService.sendMail(
    //     doctorRecord.doctor?.email,
    //     `Xin chào bác sĩ ${doctorRecord.doctor?.fullName}`,
    //     "test",
    //     `Bác sĩ còn 30 phút nữa là đến cuộc hẹn với bệnh nhân ${appointment.patient.fullName} <br>
    //       Vào lúc ${appointment.appointment_date.time} <br>
    //       <div
    //       style="font-family: Arial, sans-serif; width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
    //       <div style="text-align: center; background-color: #b2ebf2; padding: 15px; border-radius: 8px 8px 0 0;">
    //           <h2 style="margin: 0; color: #000;">Phiếu khám bệnh</h2>
    //       </div>
    //       <div
    //           style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);font-size: 16px;">
    //           <h2 style="text-align: center; color: #000; margin-top: 0;">${category_sick}</h2>
    //           <p style="text-align: center; color: #777; margin-bottom: 20px;">Địa chỉ: ${category}</p>
    //           <hr style="border: 0; height: 2px; background-color: #ccc;">
    //           <div style="text-align: center; margin-bottom: 30px;">
    //               <p style="font-size: 24px; color: #000; margin: 0;">Thời gian khám</p>
    //               <h1 style="font-size: 48px; color: #000; margin: 0;">${appointment.appointment_date.time}</h1>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Dịch vụ:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Chuyên khoa:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category_sick}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Bác sĩ:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${doctorRecord.doctor.fullName}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Ngày khám:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>
    //                       ${appointment.appointment_date.day}-${appointment.appointment_date.month}-${appointment.appointment_date.year}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Giờ khám:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${appointment.appointment_date.time}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Phí khám:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${appointment.price_list.price} VND</strong></p>
    //           </div>
    //            <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Trạng thái:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>Đã thanh toán</strong></p>
    //           </div>
    //           <hr style="border: 0; height: 2px; background-color: #ccc;">
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Bệnh nhân:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${appointment.patient.fullName} </strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Giới tính:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${sex}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${appointment.patient.phone}</strong></p>
    //           </div>
    //           <div
    //               style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
    //               <p style="width: 30%; margin-left: 70px;">Email:</p>
    //               <p style="text-align:right; width: 70%; margin-right: 30px;text-decoration: none; color: #000;"><strong>${appointment.patient.email}</strong></p>
    //           </div>
    //           <div style="text-align: center; margin-top: 20px;">
    //               <a href="https://health-haven-seven.vercel.app/zero/${appointment._id}/doctor" style="text-decoration: none;">
    //                 <button style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; width: 80%; cursor: pointer;">Vào khám</button>
    //               </a>
    //           </div>
    //       </div>
    //   </div>
    //       `
    //   );
    const dataComplete = {
        _id: appointment._id,
        status: "COMPLETED",
        status_message: "Đã hoàn tất lịch hẹn",
    }
     await appointmentService.doctorComplete(dataComplete);
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
      console.log("Không có lịch hẹn nào cần thông báo đã hoàn thành");
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