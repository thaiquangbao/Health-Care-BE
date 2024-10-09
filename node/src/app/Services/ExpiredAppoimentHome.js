const cron = require("node-cron");
const moment = require("moment-timezone");
const mailService = require("../Services/MailerService"); 
const appointmentHomeService = require("../Services/AppointmentHomeService");
const noticeService = require("../Services/NoticeService");
const doctorRecordModel = require("../models/doctorRecordModel");
const doctorRecordService = require("../Services/AppointmentService/DoctorRecordService");
class ExpiredAppointmentHomeService {
    async notification(acceptedAppointmentHome) {
        const [hours, minutes] =acceptedAppointmentHome.timeLimit.time.split(":").map(Number);
        const appointmentHomeDate = moment.tz(
        {
            year: acceptedAppointmentHome.timeLimit.year,
            month: acceptedAppointmentHome.timeLimit.month - 1,
            day: acceptedAppointmentHome.timeLimit.day,
            hour: hours,
            minute: minutes,
        },
            "Asia/Ho_Chi_Minh"
        );
        const now = moment.tz("Asia/Ho_Chi_Minh");
        const isSameTime = appointmentHomeDate.isSameOrBefore(now, 'minute');
        if(isSameTime === true) {
          const dataExpired = {
            _id: acceptedAppointmentHome._id,
            status: {
              status_type: "CANCELED",
              message: "Lịch hẹn đã hết hạn thanh toán",
            },
            processAppointment: 0,
          }
          const doctorRecord = await doctorRecordModel.findById(
            acceptedAppointmentHome.doctor_record_id
          );
          await appointmentHomeService.updateOne(dataExpired);
          const messagePatient = {
            title: "Hết hạn lịch hẹn khám tại nhà",
            content: `Lịch hẹn khám tại nhà của bạn vào lúc ${acceptedAppointmentHome.appointment_date.time} ngày ${acceptedAppointmentHome.appointment_date.day}/${acceptedAppointmentHome.appointment_date.month}/${acceptedAppointmentHome.appointment_date.year} với BS. ${doctorRecord.doctor.fullName} đã hết hạn thanh toán. Hãy đặt một lịch mới với bác sĩ nhé!!!`,
            category: "APPOINTMENTHOME",
            date: {
              day: acceptedAppointmentHome.timeLimit.day,
              month: acceptedAppointmentHome.timeLimit.month,
              year: acceptedAppointmentHome.timeLimit.year,
            },
            attached: acceptedAppointmentHome._id,
            user: acceptedAppointmentHome.patient._id,
          };
          const messageDoctor = {
            title: "Hết hạn lịch hẹn khám tại nhà",
            content: `Lịch hẹn khám tại nhà của bác sĩ với bệnh nhân ${acceptedAppointmentHome.patient.fullName} vào lúc ${acceptedAppointmentHome.appointment_date.time} ngày ${acceptedAppointmentHome.appointment_date.day}/${acceptedAppointmentHome.appointment_date.month}/${acceptedAppointmentHome.appointment_date.year} đã hết hạn. Do bệnh nhân chưa thanh toán!!!`,
            category: "APPOINTMENTHOME",
            date: {
              day: acceptedAppointmentHome.timeLimit.day,
              month: acceptedAppointmentHome.timeLimit.month,
              year: acceptedAppointmentHome.timeLimit.year,
            },
            attached: acceptedAppointmentHome._id,
            user: doctorRecord.doctor._id,
          };
          noticeService.create(messagePatient);
          noticeService.create(messageDoctor);
          await mailService.sendMail(
            doctorRecord.doctor.email,
            "Hết hạn lịch hẹn khám tại nhà",
            `Lịch hẹn khám tại nhà của bác sĩ với bệnh nhân ${acceptedAppointmentHome.patient.fullName} vào lúc ${acceptedAppointmentHome.appointment_date.time} ngày ${acceptedAppointmentHome.appointment_date.day}/${acceptedAppointmentHome.appointment_date.month}/${acceptedAppointmentHome.appointment_date.year} đã hết hạn.Do bệnh nhân chưa thanh toán!!!`,
            ""
        );
        await mailService.sendMail(
          acceptedAppointmentHome.patient.email,
          "Hết hạn lịch hẹn khám tại nhà",
          `Lịch hẹn khám tại nhà của bạn vào lúc ${acceptedAppointmentHome.appointment_date.time} ngày ${acceptedAppointmentHome.appointment_date.day}/${acceptedAppointmentHome.appointment_date.month}/${acceptedAppointmentHome.appointment_date.year} với BS. ${doctorRecord.doctor.fullName} đã hết hạn thanh toán. Hãy đặt một lịch mới với bác sĩ nhé!!!`,
          ""
      );
      // update lại lịch cho bác sĩ và bệnh nhân
        const dataRemoveSchedule = {
          doctor_record_id: acceptedAppointmentHome.doctor_record_id,
          date: {
            day: acceptedAppointmentHome.appointment_date.day,
            month: acceptedAppointmentHome.appointment_date.month,
            year: acceptedAppointmentHome.appointment_date.year,
          },
          time: acceptedAppointmentHome.appointment_date.time,
        };
        await doctorRecordService.removeSchedule(dataRemoveSchedule);
          console.log(`Đã gửi thông báo hết hạn lịch hẹn khám tại nhà cho BS. ${doctorRecord.doctor.fullName} và bệnh nhân ${acceptedAppointmentHome.patient.fullName}`);
        } else {
          console.log("Chưa có lịch hẹn khám tại nhà nào hết hạn");
          
        }
       
      
    }
    async startAppointmentHomeFetch() {
        cron.schedule("*/10 * * * *", async () => {
        try {
            const appointmentHomes = await appointmentHomeService.getAll();
            const acceptedAppointmentHomes = appointmentHomes.filter(
            (appointment) => appointment.status.status_type === "ACCEPTED" && appointment.processAppointment === 1
            );
            for (const acceptedAppointmentHome of acceptedAppointmentHomes) {
                this.notification(acceptedAppointmentHome);
            }
        } catch (error) {
            console.error(
            "Error fetching HeartLogBook:",
            error
            );
        }
        });
    }
}
module.exports = new ExpiredAppointmentHomeService();