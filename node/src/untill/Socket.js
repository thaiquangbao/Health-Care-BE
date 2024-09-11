const { Server } = require("socket.io");
const roomService = require("../app/Services/ChatService/RoomsService");
const emitter = require("../config/Emitter/emitter");
const mailService = require("../app/Services/MailerService");
const doctorRecordModel = require("../app/models/doctorRecordModel");
const appointmentService = require("../app/Services/AppointmentService/AppointmentService");
const noticeService = require("../app/Services/NoticeService");
const socket = (server, baseURL) => {
  const io = new Server(server, {
    cors: {
      origin: baseURL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    // Heart log book
    // emitter.on("health-logbook-blood.create", async (data) => {
    //   socket.emit(`health-logbook-blood.create${data.data.doctor._id}`, data.messageDoctor);
    // });
    // Phòng chat
    emitter.on("room.create", (room) => {
      socket.emit("room.create", room);
    });
    emitter.on("room.update", (room) => {
      socket.emit(`room.update${room._id}`, room);
    });
    // Notice 
    emitter.on("notice.create", async (notice) => {
      const result = await notice;
      socket.emit(`notice.create${result.user}`,await result);
    });

    // message
    emitter.on("message.create", (message) => {
      socket.emit(`message.create${message.room}`, message);
    });
    emitter.on("message.update", (message) => {
      socket.emit(`message.update${message.room}`, message);
    });
    // health log book
    emitter.on("health-logbook-blood.update", (data) => {
      socket.emit(`health-logbook-blood.update${data._id}`, {
        data,
        type: "blood",
      });
    });
    emitter.on("health-logbook-temperature.update", (data) => {
      socket.emit(`health-logbook-temperature.update${data._id}`, {
        data,
        type: "temperature",
      });
    });
    emitter.on("health-logbook-health.update", (data) => {
      socket.emit(`health-logbook-health.update${data._id}`, {
        data,
        type: "health",
      });
    });
    emitter.on("health-logbook-bmi.update", (data) => {
      socket.emit(`health-logbook-bmi.update${data._id}`, {
        data,
        type: "bmi",
      });
    });
    emitter.on("health-logbook-symptom.update", (data) => {
      socket.emit(`health-logbook-symptom.update${data._id}`, {
        data,
        type: "symptom",
      });
    });
    emitter.on("health-logbook-doctor.transfer", (data) => {
      socket.emit(`health-logbook-doctor.transfer${data.dataTransfer._id}`, data.dataTransfer);
      socket.emit(`health-logbook-doctor.transfer${data.dataNew.doctor._id}`, data.dataNew);
    });
    emitter.on("health-logbook-doctor.stopped", (data) => {
      socket.emit(`health-logbook-doctor.stopped${data._id}`, data);
    });
    // heart warning AI
    emitter.on("bloodPressure-warning.ai", (data) => {
      socket.emit(`bloodPressure-warning.ai${data.user}`, data);
    })
    emitter.on("bmi-warning.ai", (data) => {
      socket.emit(`bmi-warning.ai${data.user}`, data);
    })
     emitter.on("heartRate-warning.ai", (data) => {
      socket.emit(`heartRate-warning.ai${data.user}`, data);
    })
     emitter.on("temperature-warning.ai", (data) => {
      socket.emit(`temperature-warning.ai${data.user}`, data);
    })
    //disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
  // send mail accept
  emitter.on("send-email.accept", async (data) => {
    const rs = await appointmentService.getById(data._id);
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    let category_sick = "";
    let sex = "";
    let category = "";
    if (!data.sick) {
      category_sick = "Tim mạch";
    } else {
      category_sick = data.sick;
    }
    if (!rs.patient.sex) {
      sex = "Nữ";
    } else {
      sex = "Nam";
    }
    if (rs.price_list.type === "Online") {
      category = "Tư vấn online";
    } else {
      category = "Tư vấn trực tiếp";
    }
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Xác nhận lịch hẹn",
      "",
      `Bác sĩ ${recordDoctor.doctor.fullName} đã xác nhận lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} <br>
       Đây là phiếu khám của bạn: <br>
      <div
          style="font-family: Arial, sans-serif; width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; background-color: #b2ebf2; padding: 15px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #000;">Phiếu khám bệnh</h2>
          </div>
          <div
              style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);font-size: 16px;">
              <h2 style="text-align: center; color: #000; margin-top: 0;">${category_sick}</h2>
              <p style="text-align: center; color: #777; margin-bottom: 20px;">Địa chỉ: ${category}</p>
              <hr style="border: 0; height: 2px; background-color: #ccc;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <p style="font-size: 24px; color: #000; margin: 0;">Thời gian khám</p>
                  <h1 style="font-size: 48px; color: #000; margin: 0;">${rs.appointment_date.time}</h1>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Dịch vụ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Chuyên khoa:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category_sick}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Bác sĩ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${recordDoctor.doctor.fullName}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Ngày khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>
                          ${rs.appointment_date.day}-${rs.appointment_date.month}-${rs.appointment_date.year}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giờ khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${rs.appointment_date.time}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Phí khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${rs.price_list.price} VND</strong></p>
              </div>
                <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Trạng thái:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>Đã thanh toán</strong></p>
              </div>
              <hr style="border: 0; height: 2px; background-color: #ccc;">
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Bệnh nhân:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${rs.patient.fullName} </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giới tính:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${sex}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${rs.patient.phone}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Email:</p>
                  <p style="text-align:right; width: 70%; margin-right: 30px;text-decoration: none; color: #000;"><strong>${rs.patient.email}</strong></p>
              </div>
          </div>
      </div>`
    );
    //`Bác sĩ ${recordDoctor.doctor.fullName} đã xác nhận lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}`
    if (!mail) {
      return 2;
    }
    return 1;
  });
  // deny mail
  emitter.on("send-email.deny", async (rs) => {
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Từ chối lịch hẹn",
      `Bác sĩ ${recordDoctor.doctor.fullName} đã từ chối lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}`,
      ""
    );
    if (!mail) {
      return 2;
    }
    return 1;
  });
  //cancel mail
  emitter.on("send-email.cancel", async (data) => {
    const { rs, note } = data;
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Hủy lịch hẹn",
      `Bác sĩ ${recordDoctor.doctor.fullName} đã hủy lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}. Lý do: ${note}`,
      ""
    );
    if (!mail) {
      return 2;
    }
    return 1;
  });
};

module.exports = socket;
