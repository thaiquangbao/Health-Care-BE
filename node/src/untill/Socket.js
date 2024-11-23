const { Server } = require("socket.io");
const roomService = require("../app/Services/ChatService/RoomsService");
const emitter = require("../config/Emitter/emitter");
const mailService = require("../app/Services/MailerService");
const doctorRecordModel = require("../app/models/doctorRecordModel");
const appointmentService = require("../app/Services/AppointmentService/AppointmentService");
const noticeService = require("../app/Services/NoticeService");
const appointmentHomeService = require("../app/Services/AppointmentHomeService");
const doctorRecordService = require("../app/Services/AppointmentService/DoctorRecordService");
const paymentService = require("../app/Services/PaymentService");
const payBackService = require("../app/Services/PayBackService");
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
      socket.emit(`notice.create${result.user}`, await result);
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
    emitter.on("health-logbook-doctor.accepted", (data) => {
      socket.emit(
        `health-logbook-doctor.accepted${data.logBook.patient._id}`,
        data.room
      );
    });
    emitter.on("health-logbook-doctor.transfer", (data) => {
      // socket.emit(`health-logbook-doctor.transfer${data.dataTransfer._id}`, data.dataTransfer);
      // socket.emit(`health-logbook-doctor.transfer${data.dataNew.doctor._id}`, data.dataNew);
      socket.emit(`health-logbook-doctor.transfer${data.room._id}`, data.room);
    });
    // emitter.on("health-logbook-doctor.stopped", (data) => {
    //   socket.emit(`health-logbook-doctor.stopped${data._id}`, data);
    // });
    emitter.on("health-logbook-completed.update", (data) => {
      socket.emit(`health-logbook-completed.update${data._id}`, data);
    });
    // heart warning AI
    emitter.on("bloodPressure-warning.ai", (data) => {
      socket.emit(`bloodPressure-warning.ai${data.user}`, data);
    });
    emitter.on("bmi-warning.ai", (data) => {
      socket.emit(`bmi-warning.ai${data.user}`, data);
    });
    emitter.on("heartRate-warning.ai", (data) => {
      socket.emit(`heartRate-warning.ai${data.user}`, data);
    });
    emitter.on("temperature-warning.ai", (data) => {
      socket.emit(`temperature-warning.ai${data.user}`, data);
    });
    // payment
    emitter.on("payment-appointment-online", (data) => {
      const contentLowerCase = data.content.toLowerCase();
      const start = contentLowerCase.indexOf("makh") + 4;
      const end = contentLowerCase.indexOf("2b", start);
      const user = data.content.toLowerCase().substring(start, end);
      socket.emit(`payment-appointment-online${user}`, data);
    });
    emitter.on("payment-appointment-offline", (data) => {
      const contentLowerCase = data.content.toLowerCase();
      const start = contentLowerCase.indexOf("makh") + 4;
      const end = contentLowerCase.indexOf("2b", start);
      const user = data.content.toLowerCase().substring(start, end);
      socket.emit(`payment-appointment-offline${user}`, data);
    });
    emitter.on("payment-appointment-logbooks", (data) => {
      const contentLowerCase = data.content.toLowerCase();
      const start = contentLowerCase.indexOf("makh") + 4;
      const end = contentLowerCase.indexOf("2b", start);
      const user = data.content.toLowerCase().substring(start, end);
      socket.emit(`payment-appointment-logbooks${user}`, data);
    });
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
    const payment = {
      patient_id: rs.patient._id,
      doctor_id: recordDoctor.doctor._id,
      category: rs._id,
      namePayment: "APPOINTMENT",
      status_payment: {
        type: "PENDING",
        messages: "Đang chờ xử lý",
      },
      price: 200000,
      date: rs.appointment_date,
      beneficiaryAccount: {
        accountNumber: "",
        bankName: "",
        accountName: "",
      },
      description: rs.status_message,
    };
    await paymentService.save(payment);
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
    const payment = {
      patient_id: rs.patient._id,
      doctor_id: recordDoctor.doctor._id,
      category: rs._id,
      namePayment: "APPOINTMENT",
      status_payment: {
        type: "PENDING",
        messages: "Đang chờ xử lý",
      },
      price: 200000,
      date: rs.appointment_date,
      beneficiaryAccount: {
        accountNumber: "",
        bankName: "",
        accountName: "",
      },
      description: note,
    };
    await paymentService.save(payment);
    if (!mail) {
      return 2;
    }
    return 1;
  });
  emitter.on("send-email-patient.cancel", async (rs) => {
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const payment = {
      patient_id: rs.patient._id,
      doctor_id: recordDoctor.doctor._id,
      category: rs._id,
      namePayment: "APPOINTMENT",
      status_payment: {
        type: "PENDING",
        messages: "Đang chờ xử lý",
      },
      price: 200000,
      date: rs.appointment_date,
      beneficiaryAccount: {
        accountNumber: "",
        bankName: "",
        accountName: "",
      },
      description: rs.status_message,
    };
    return await paymentService.save(payment);
  });
  emitter.on("doctor-appointment-logbook.submit", async (data) => {
    const rs = await appointmentService.getById(data._id);
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    let category_sick = "";
    let sex = "";
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
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Xác nhận lịch hẹn",
      "",
      `Bác sĩ ${recordDoctor.doctor.fullName} đã tạo lịch hẹn khám định kỳ với bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} <br>
       Đây là phiếu khám của bạn: <br>
      <div
          style="font-family: Arial, sans-serif; width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; background-color: #b2ebf2; padding: 15px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #000;">Phiếu khám bệnh</h2>
          </div>
          <div
              style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);font-size: 16px;">
              <h2 style="text-align: center; color: #000; margin-top: 0;">${category_sick}</h2>
              <p style="text-align: center; color: #777; margin-bottom: 20px;">Địa chỉ: ${rs.price_list.type}</p>
              <hr style="border: 0; height: 2px; background-color: #ccc;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <p style="font-size: 24px; color: #000; margin: 0;">Thời gian khám</p>
                  <h1 style="font-size: 48px; color: #000; margin: 0;">${rs.appointment_date.time}</h1>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Dịch vụ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${rs.price_list.type}</strong></p>
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
  emitter.on("send-email-appointment-home.accept", async (data) => {
    const rs = await appointmentHomeService.getById(data._id);
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    let category_sick = "";
    let sex = "";

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
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Xác nhận lịch hẹn khám tại nhà",
      "",
      `Bác sĩ ${
        recordDoctor.doctor.fullName
      } đã xác nhận lịch hẹn khám tại nhà của bạn vào lúc ${
        rs.appointment_date.time
      } ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${
        rs.appointment_date.year
      }. Hãy tiến hành thanh toán!!! <br>
       Đây là phiếu khám của bạn: <br>
      <div
          style="font-family: Arial, sans-serif; width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; background-color: #b2ebf2; padding: 15px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #000;">Phiếu khám bệnh</h2>
          </div>
          <div
              style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);font-size: 16px;">
              <h2 style="text-align: center; color: #000; margin-top: 0;">Khám sức khỏe tại nhà</h2>
              <p style="text-align: center; color: #777; ">Địa chỉ: ${
                rs.patient.address !== ""
                  ? rs.patient.address
                  : "Tư vấn tại nhà"
              }</p>
              <h2 style="text-align: center; color: #EE0000; margin-top: 10px;margin-bottom: 20px;">Đang chờ bệnh nhân thanh toán</h2>
              <hr style="border: 0; height: 2px; background-color: #ccc;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <p style="font-size: 24px; color: #000; margin: 0;">Thời gian khám</p>
                  <h1 style="font-size: 48px; color: #000; margin: 0;">${
                    rs.appointment_date.time
                  }</h1>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Dịch vụ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category_sick}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Chuyên khoa:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> Tim mạch </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Bác sĩ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${
                    recordDoctor.doctor.fullName
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Ngày khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>
                          ${rs.appointment_date.day}-${
        rs.appointment_date.month
      }-${rs.appointment_date.year}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giờ khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.appointment_date.time
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Phí khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>300.000 VND</strong></p>
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
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.patient.fullName
                  } </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giới tính:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${sex}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.patient.phone
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Email:</p>
                  <p style="text-align:right; width: 70%; margin-right: 30px;text-decoration: none; color: #000;"><strong>${
                    rs.patient.email
                  }</strong></p>
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
  emitter.on("send-email-appointment-home.deny", async (rs) => {
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Từ chối lịch hẹn khám tại nhà",
      `Bác sĩ ${recordDoctor.doctor.fullName} đã từ chối lịch hẹn khám tại nhà với bạn. Hãy đăng ký một lịch hẹn khác nhé !!!`,
      ""
    );
    //  const dataRemoveSchedule = {
    //   doctor_record_id: rs.doctor_record_id,
    //   date: {
    //     day: rs.appointment_date.day,
    //     month: rs.appointment_date.month,
    //     year: rs.appointment_date.year,
    //   },
    //   time: rs.appointment_date.time,
    // };
    // await doctorRecordService.removeSchedule(dataRemoveSchedule);
    if (!mail) {
      return 2;
    }
    return 1;
  });
  //cancel mail
  emitter.on("send-email-appointment-home.cancel", async (data) => {
    const { rs, note } = data;
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Hủy lịch hẹn",
      `Bác sĩ ${recordDoctor.doctor.fullName} đã hủy lịch hẹn khám tại nhà với bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}. Lý do: ${note}`,
      ""
    );
    const dataRemoveSchedule = {
      doctor_record_id: rs.doctor_record_id,
      date: {
        day: rs.appointment_date.day,
        month: rs.appointment_date.month,
        year: rs.appointment_date.year,
      },
      time: rs.appointment_date.time,
    };
    await doctorRecordService.removeSchedule(dataRemoveSchedule);
    if (!mail) {
      return 2;
    }
    return 1;
  });
  // payment appointment home
  emitter.on("send-email-appointment-home.payment", async (data) => {
    const rs = await appointmentHomeService.getById(data._id);
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    let category_sick = "";
    let sex = "";

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
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Thanh toán thành công lịch hẹn khám tại nhà",
      "",
      `Bạn đã thanh toán thành công lịch hẹn khám tại nhà với BS. ${
        recordDoctor.doctor.fullName
      } vào lúc (${rs.appointment_date.time}) ngày ${rs.appointment_date.day}/${
        rs.appointment_date.month
      }/${rs.appointment_date.year}. <br>
       Đây là phiếu khám của bạn: <br>
      <div
          style="font-family: Arial, sans-serif; width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; background-color: #b2ebf2; padding: 15px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #000;">Phiếu khám bệnh</h2>
          </div>
          <div
              style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);font-size: 16px;">
              <h2 style="text-align: center; color: #000; margin-top: 0;">Khám sức khỏe tại nhà</h2>
              <p style="text-align: center; color: #777; ">Địa chỉ: ${
                rs.patient.address !== ""
                  ? rs.patient.address
                  : "Tư vấn tại nhà"
              }</p>
              <h2 style="text-align: center; color: #00FF00; margin-top: 10px;margin-bottom: 20px;">Đã thanh toán</h2>
              <hr style="border: 0; height: 2px; background-color: #ccc;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <p style="font-size: 24px; color: #000; margin: 0;">Thời gian khám</p>
                  <h1 style="font-size: 48px; color: #000; margin: 0;">${
                    rs.appointment_date.time
                  }</h1>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Dịch vụ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category_sick}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Chuyên khoa:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> Tim mạch </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Bác sĩ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${
                    recordDoctor.doctor.fullName
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${
                    recordDoctor.doctor.phone
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Ngày khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>
                          ${rs.appointment_date.day}-${
        rs.appointment_date.month
      }-${rs.appointment_date.year}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giờ khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.appointment_date.time
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Phí khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>300.000 VND</strong></p>
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
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.patient.fullName
                  } </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giới tính:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${sex}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.patient.phone
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Email:</p>
                  <p style="text-align:right; width: 70%; margin-right: 30px;text-decoration: none; color: #000;"><strong>${
                    rs.patient.email
                  }</strong></p>
              </div>
          </div>
      </div>`
    );
    await mailService.sendMail(
      recordDoctor.doctor.email,
      "Bệnh nhân đã thanh toán lịch hẹn khám tại nhà",
      "",
      `Bệnh nhân ${
        rs.patient.fullName
      } đã thanh toán thành công lịch hẹn khám tại nhà với bác sĩ  vào lúc (${
        rs.appointment_date.time
      }) ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${
        rs.appointment_date.year
      }. <br>
       Đây là phiếu khám của bệnh nhân: <br>
      <div
          style="font-family: Arial, sans-serif; width: 600px; margin: 0 auto; background-color: #f7f7f7; padding: 20px; border-radius: 8px;">
          <div style="text-align: center; background-color: #b2ebf2; padding: 15px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0; color: #000;">Phiếu khám bệnh</h2>
          </div>
          <div
              style="padding: 20px; background-color: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);font-size: 16px;">
              <h2 style="text-align: center; color: #000; margin-top: 0;">Khám sức khỏe tại nhà</h2>
              <p style="text-align: center; color: #777; ">Địa chỉ: ${
                rs.patient.address !== ""
                  ? rs.patient.address
                  : "Tư vấn tại nhà"
              }</p>
              <h2 style="text-align: center; color: #00FF00; margin-top: 10px;margin-bottom: 20px;">Đã thanh toán</h2>
              <hr style="border: 0; height: 2px; background-color: #ccc;">
              <div style="text-align: center; margin-bottom: 30px;">
                  <p style="font-size: 24px; color: #000; margin: 0;">Thời gian khám</p>
                  <h1 style="font-size: 48px; color: #000; margin: 0;">${
                    rs.appointment_date.time
                  }</h1>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Dịch vụ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${category_sick}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Chuyên khoa:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> Tim mạch </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Bác sĩ:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${
                    recordDoctor.doctor.fullName
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong> ${
                    recordDoctor.doctor.phone
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Ngày khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>
                          ${rs.appointment_date.day}-${
        rs.appointment_date.month
      }-${rs.appointment_date.year}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giờ khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.appointment_date.time
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Phí khám:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>300.000 VND</strong></p>
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
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.patient.fullName
                  } </strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Giới tính:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${sex}</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Số điện thoại:</p>
                  <p style="text-align:right; width: 70%; margin-right: 60px;"><strong>${
                    rs.patient.phone
                  }</strong></p>
              </div>
              <div
                  style="display: flex;justify-content: space-between; font-size: 18px; color: #000; margin-bottom: 10px;">
                  <p style="width: 30%; margin-left: 70px;">Email:</p>
                  <p style="text-align:right; width: 70%; margin-right: 30px;text-decoration: none; color: #000;"><strong>${
                    rs.patient.email
                  }</strong></p>
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
  emitter.on("send-email-appointment-home.complete", async (data) => {
    const rs = await appointmentHomeService.getById(data._id);
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const dataPayback = {
      doctor_id: recordDoctor.doctor._id,
      type: "APPOINTMENTHOME",
      service_id: data._id,
      status: {
        type: "AVAILABLE",
        messages: "Khả dụng",
      },
      price: 210000,
      date: rs.appointment_date,
    };
    await payBackService.save(dataPayback);
    await doctorRecordModel.findByIdAndUpdate(
      recordDoctor._id,
      {
        examination_call: recordDoctor.examination_call + 1,
      },
      { new: true }
    );
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Lịch hẹn khám tại nhà đã hoàn tất",
      "",
      `Lịch hẹn khám tại nhà của bạn với BS. ${recordDoctor.doctor.fullName} vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} đã hoàn tất.Hãy đánh giá cho bác sĩ nhé. Cảm ơn bạn đã sử dụng dịch vụ tại Health-heaven!!! <br>
      `
    );
    //`Bác sĩ ${recordDoctor.doctor.fullName} đã xác nhận lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}`
    if (!mail) {
      return 2;
    }
    return 1;
  });
  emitter.on("send-email-appointment-home-patient.cancel", async (rs) => {
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const dataRemoveSchedule = {
      doctor_record_id: rs.doctor_record_id,
      date: {
        day: rs.appointment_date.day,
        month: rs.appointment_date.month,
        year: rs.appointment_date.year,
      },
      time: rs.appointment_date.time,
    };
    const dataRemove = await doctorRecordService.removeSchedule(
      dataRemoveSchedule
    );
    const messagePatient = {
      title: "Hủy lịch hẹn thành công",
      content: `Bạn đã hủy lịch hẹn khám tại nhà với BS. ${recordDoctor.doctor.fullName} thành công. Hãy đặt một lịch khám mới nhé!!!`,
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
      title: "Lịch hẹn khám tại nhà bị hủy",
      content: `Bác sĩ có một lịch hẹn khám tại nhà bị hủy. Bấm vào để xem thông tin chi tiết!!!`,
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

    return dataRemove;
  });
  emitter.on("health-logbook-doctor.rejected", async (rs) => {
    const payment = {
      patient_id: rs.patient._id,
      doctor_id: rs.doctor._id,
      category: rs._id,
      namePayment: "HEALTHLOGBOOK",
      status_payment: {
        type: "PENDING",
        messages: "Đang chờ xử lý",
      },
      price: rs.priceList.price,
      date: rs.date,
      beneficiaryAccount: {
        accountNumber: "",
        bankName: "",
        accountName: "",
      },
      description: rs.status?.message,
    };
    await paymentService.save(payment);
  });
  emitter.on("health-logbook-doctor.canceled", async (rs) => {
    const payment = {
      patient_id: rs.patient._id,
      doctor_id: rs.doctor._id,
      category: rs._id,
      namePayment: "HEALTHLOGBOOK",
      status_payment: {
        type: "PENDING",
        messages: "Đang chờ xử lý",
      },
      price: rs.priceList.price,
      date: rs.date,
      beneficiaryAccount: {
        accountNumber: "",
        bankName: "",
        accountName: "",
      },
      description: rs.status?.message,
    };
    await paymentService.save(payment);
  });
  emitter.on("request-status", async (rs) => {
    const currentDate = new Date();
    const vietnamTimeOffset = 7 * 60; // GMT+7 in minutes
    const localTimeOffset = currentDate.getTimezoneOffset(); // Local timezone offset in minutes
    const vietnamTime = new Date(
      currentDate.getTime() + (vietnamTimeOffset + localTimeOffset) * 60000
    );
    const time = {
      day: vietnamTime.getDate(),
      month: vietnamTime.getMonth() + 1,
      year: vietnamTime.getFullYear(),
      time: `${vietnamTime.getHours()}:${vietnamTime.getMinutes()}`,
    };
    const payment = {
      doctor_id: rs.doctor_id,
      namePayment: "PAYBACK",
      status_take_money: {
        type: "PENDING",
        messages: "Đang chờ xử lý",
      },
      price: rs.priceValid,
      dateTake: time,
      beneficiaryAccount: {
        accountNumber: "",
        bankName: "",
        accountName: "",
      },
      descriptionTake: rs.descriptionTake,
    };
    return await paymentService.save(payment);
  });
  emitter.on("send-notice-customer.submit", async (rs) => {
    const recordDoctor = await doctorRecordModel.findById(rs.doctor_record_id);
    const mail = await mailService.sendMail(
      rs.patient.email,
      "Đặt lịch hẹn khám thành công",
      "",
      `Bạn đã đặt lịch hẹn tư vấn sức khỏe trực tuyến thành công với BS. ${recordDoctor.doctor.fullName} vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year} .Hãy chờ bác sĩ xác nhận nhé.!!!
    `
    );
    //`Bác sĩ ${recordDoctor.doctor.fullName} đã xác nhận lịch hẹn của bạn vào lúc ${rs.appointment_date.time} ngày ${rs.appointment_date.day}/${rs.appointment_date.month}/${rs.appointment_date.year}`
    if (!mail) {
      return 2;
    }
    return 1;
  });
  // emitter.on("accept-status", async (rs) => {
  //   const currentDate = new Date();
  //   const vietnamTimeOffset = 7 * 60; // GMT+7 in minutes
  //   const localTimeOffset = currentDate.getTimezoneOffset(); // Local timezone offset in minutes
  //   const vietnamTime = new Date(
  //     currentDate.getTime() +
  //       (vietnamTimeOffset + localTimeOffset) * 60000
  //   );
  //   const time = {
  //     day: vietnamTime.getDate(),
  //     month: vietnamTime.getMonth() + 1,
  //     year: vietnamTime.getFullYear(),
  //     time: `${vietnamTime.getHours()}:${vietnamTime.getMinutes()}`,
  //   };
  //   const payment = {
  //     doctor_id: rs.doctor_id,
  //     namePayment: "PAYBACK",
  //     status_take_money: {
  //       type: "PENDING",
  //       messages: "Đang chờ xử lý",
  //     },
  //     price: rs.priceValid,
  //     dateTake: time,
  //     beneficiaryAccount: {
  //       accountNumber: "",
  //       bankName: "",
  //       accountName: "",
  //     },
  //     descriptionTake: rs.descriptionTake,
  //   };
  //   return await paymentService.save(payment);
  // });
};

module.exports = socket;
