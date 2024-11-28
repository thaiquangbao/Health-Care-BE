const healthLogBookModel = require("../models/healthLogBookModels");
const roomsService = require("./ChatService/RoomsService");
const messageService = require("./ChatService/MessagesService");
const noticeService = require("./NoticeService");
const mailService = require("./MailerService");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const emitter = require("../../config/Emitter/emitter");
class HealthLogBookService {
  async save(data) {
    const healthLogBook = new healthLogBookModel(data);
    const saved = await healthLogBook.save();
    const messagePatient = {
      title: "Đặt khám lâu dài",
      content: `Bạn đã đặt lịch theo dõi sức khỏe thành công với BS. ${data.doctor.fullName}. Hãy chờ bác sĩ xác nhận nhé!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: data._id,
      user: data.patient._id,
    };
    const messageDoctor = {
      title: "Đặt khám lâu dài",
      content: `Bác sĩ có lịch đặt hẹn theo dõi sức khỏe mới. Bấm vào để xem thông tin chi tiết!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: data.date.day,
        month: data.date.month,
        year: data.date.year,
      },
      attached: data._id,
      user: data.doctor._id,
    };
    noticeService.create(messagePatient);
    noticeService.create(messageDoctor);
    return { data: saved, messagePatient, messageDoctor };
  }
  async findByDoctor(id) {
    const exist = await healthLogBookModel.find({
      "doctor._id": id,
    });
    if (!exist) {
      return 0;
    }
    return exist;
  }
  async findByPatient(id) {
    const exist = await healthLogBookModel.find({
      "patient._id": id,
    });
    if (!exist) {
      return 0;
    }
    return exist;
  }
  async accepted(id, dateStop) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    if (
      exist.status.status_type !== "QUEUE" &&
      exist.status.status_type !== "TRANSFER"
    ) {
      return 2;
    }
    const updated = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "ACCEPTED",
          "status.message": "Bác sĩ đã đồng ý",
          dateStop: dateStop,
        },
      },
      { new: true }
    );
    const room = {
      patient: {
        _id: updated.patient._id,
        fullName: updated.patient.fullName,
        image: updated.patient.image,
      },
      doctor: {
        _id: updated.doctor._id,
        fullName: updated.doctor.fullName,
        image: updated.doctor.image,
      },
      lastMessage: {
        content: "Hãy bắt đầu cuộc trò chuyện !!!",
        author: "SYSTEM",
        time: updated.date,
      },
    };
    const createRoom = await roomsService.save(room);
    const message = {
      room: createRoom._id,
      messages: [
        {
          content: createRoom.lastMessage.content,
          time: createRoom.lastMessage.time,
          author: createRoom.lastMessage.author,
          type: "TEXT",
        },
      ],
    };
    const messagePatient = {
      title: "Xác nhận khám lâu dài",
      content: `Bác sĩ ${exist.doctor.fullName} đã đồng ý theo dõi sức khỏe của bạn. Hãy bắt đầu cuộc trò chuyện để bác sĩ có thể theo dõi sức khỏe của bạn nhé!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.patient._id,
    };
    noticeService.create(messagePatient);
    await messageService.save(message);
    return { logBook: updated, room: createRoom };
  }
  async getOne(id) {
    const rs = await healthLogBookModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async rejected(id) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    if (exist.status.status_type !== "QUEUE") {
      return 2;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "REJECTED",
          "status.message": "Bác sĩ đã từ chối",
        },
      },
      { new: true }
    );
    const messagePatient = {
      title: "Từ chối khám lâu dài",
      content: `Bác sĩ ${exist.doctor.fullName} đã từ chối theo dõi sức khỏe của bạn!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.patient._id,
    };
    noticeService.create(messagePatient);
    return rs;
  }
  async canceled(id) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    if (exist.status.status_type !== "QUEUE") {
      return 2;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "CANCELED",
          "status.message": "Bệnh nhân đã hủy cuộc hẹn",
        },
      },
      { new: true }
    );
    const messagePatient = {
      title: "Hủy theo dõi sức khỏe",
      content: `Bạn đã hủy theo dõi sức khỏe với BS. ${exist.doctor.fullName} thành công. Hãy đặt một lịch theo dõi sức khỏe mới nhé!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.patient._id,
    };
    const messageDoctor = {
      title: "Hủy theo dõi sức khỏe",
      content: `Bác sĩ có một lịch hẹn chờ xác nhận theo dõi sức khỏe thành công. Bấm vào để xem thông tin chi tiết!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.doctor._id,
    };
    noticeService.create(messagePatient);
    noticeService.create(messageDoctor);
    return rs;
  }
  async completed(id) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "COMPLETED",
          "status.message": "Đã hoàn thành",
        },
      },
      { new: true }
    );
    const room = {
      patient: rs.patient,
      doctor: rs.doctor,
    };
    const rsRoom = await roomsService.updateStatusRoom(room);
    if (rsRoom === 0) {
      return 2;
    }
    const messagePatient = {
      title: "Hoàn thành khám lâu dài",
      content: `Lịch theo giỏi sức khỏe của bạn vào ngày ${rs.date.day}-${rs.date.month}-${rs.date.year} với BS. ${rs.doctor.fullName} (${rs.priceList.price}đ/${rs.priceList.type}) đã hoàn tất!!!. Cảm ơn bạn đã sử dụng dịch vụ`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.patient._id,
    };
    const messageDoctor = {
      title: "Hoàn thành khám lâu dài",
      content: `Lịch theo giỏi sức khỏe của bác sĩ vào ngày ${rs.date.day}-${rs.date.month}-${rs.date.year} với bệnh nhân ${rs.patient.fullName} (${rs.priceList.price}đ/${rs.priceList.type}) đã hoàn tất!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.doctor._id,
    };
    emitter.emit("health-logbook-completed.update", rsRoom);
    noticeService.create(messagePatient);
    noticeService.create(messageDoctor);
    return rs;
  }
  async updateDoctor(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    // dateStop Này là ngày bắt chuyển bác sĩ
    // Dữ liệu cũ
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          status: data.status,
        },
      },
      { new: true }
    );
    // Dữ liệu mới
    const dataNew = {
      patient: rs.patient,
      doctor: data.doctor,
      priceList: rs.priceList,
      date: rs.date, //  Lấy ngày bắt đầu chuyển làm ngày bắt đầu mới
      status: data.statusNew,
      dateStop: rs.dateStop, // Ngày kết thúc mới
    };
    const healthLogBook = new healthLogBookModel(dataNew);
    const saved = await healthLogBook.save();
    const room = {
      patient: rs.patient,
      doctor: rs.doctor,
    };
    const rsRoom = await roomsService.updateStatusRoom(room);
    if (rsRoom === 0) {
      return 2;
    }
    const messagePatient = {
      title: "Chuyển bác sĩ",
      content: `BS. ${exist.doctor.fullName} đã chuyển bạn sang BS. ${data.doctor.fullName}. Hãy chờ bác sĩ mới xác nhận nhé!!!`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.patient._id,
    };
    const messageDoctor = {
      title: "Chuyển bác sĩ",
      content: `Bác sĩ đã được chuyển một bệnh nhân mới từ bác sĩ ${exist.doctor.fullName}. Bấm vào để xem thông tin chi tiết!!!.`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: saved._id,
      user: data.doctor._id,
    };
    noticeService.create(messagePatient);
    noticeService.create(messageDoctor);
    return {
      dataTransfer: rs,
      dataNew: saved,
      room: rsRoom,
    };
  }
  async stopped(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "STOPPED",
          "status.message": "Đã dừng điều trị",
          dateStop: data.dateStop,
        },
      },
      { new: true }
    );
    const messagePatient = {
      title: "Dừng theo dõi sức khỏe",
      content: `BS. ${exist.doctor.fullName} đã dừng theo dõi sức khỏe với bạn.`,
      category: "HEARTLOGBOOK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: exist._id,
      user: exist.patient._id,
    };
    noticeService.create(messagePatient);
    return rs;
  }
  async update(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, data, {
      new: true,
    });
    return rs;
  }
  async getAll() {
    return await healthLogBookModel.find();
  }
  async findByDay(dataSearch) {
    // Chuyển đổi dữ liệu từ client thành định dạng ISO
    // Tìm kiếm theo ngày
    const rs = await healthLogBookModel
      .find({
        $and: [
          {
            "doctor._id": dataSearch.doctor,
          },
          {
            "date.day": dataSearch.date.day,
            "date.month": dataSearch.date.month,
            "date.year": dataSearch.date.year,
          },
        ],
      })
      .lean();

    return rs;
  }
  async findByNextDay(dataSearch) {
    // Chuyển đổi dữ liệu từ client thành định dạng ISO
    // Tìm kiếm theo ngày
    const rs = await healthLogBookModel
      .find({
        $and: [
          {
            "doctor._id": dataSearch.doctor,
          },
          {
            "date.day": dataSearch.date.day + 1,
            "date.month": dataSearch.date.month,
            "date.year": dataSearch.date.year,
          },
        ],
      })
      .lean();

    return rs;
  }
  async findByWeak(data) {
    const startOfWeek = moment.tz("Asia/Ho_Chi_Minh").startOf("week").toDate();
    const endOfWeek = moment.tz("Asia/Ho_Chi_Minh").endOf("week").toDate();
    const startDay = startOfWeek.getDate() + 2;
    const startMonth = startOfWeek.getMonth() + 1; // Tháng trong JS bắt đầu từ 0
    const startYear = startOfWeek.getFullYear();

    const endDay = endOfWeek.getDate() + 1;
    const endMonth = endOfWeek.getMonth() + 1;
    const endYear = endOfWeek.getFullYear();
    console.log(startDay, endDay);

    const rs = await healthLogBookModel.find({
      "doctor._id": data.doctor,
      $or: [
        // Trường hợp trong cùng 1 năm và tháng
        {
          "date.year": startYear,
          "date.month": startMonth,
          "date.day": {
            $gte: startDay,
            $lte: endDay,
          },
        },
        // Trường hợp khác năm hoặc khác tháng (trường hợp tuần kéo dài qua tháng/năm)
        {
          $and: [
            {
              "date.year": {
                $gte: startYear,
                $lte: endYear,
              },
            },
            {
              $or: [
                {
                  "date.month": startMonth,
                  "date.day": {
                    $gte: startDay,
                  },
                },
                {
                  "date.month": endMonth,
                  "date.day": {
                    $lte: endDay,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    return rs;
  }
  async findByNextWeek(data) {
    const startOfNextWeek = moment().add(1, "weeks").startOf("week").toDate();
    const endOfNextWeek = moment().add(1, "weeks").endOf("week").toDate();
    const start = startOfNextWeek.getDate();
    const end = endOfNextWeek.getDate();
    const rs = await healthLogBookModel.find({
      $and: [
        { "doctor._id": data.doctor },
        { "date.day": { $gte: start, $lte: end } },
      ],
    });
    return rs;
  }
  async findByMonth(data) {
    const regex = moment().toDate();
    const rs = await healthLogBookModel.find({
      $and: [
        {
          "doctor._id": data.doctor,
        },
        {
          "date.month": regex.getMonth() + 1,
          "date.year": regex.getFullYear(),
        },
      ],
    });
    return rs;
  }
  async findByNextMonth(dataSearch) {
    const regex = moment().toDate();
    const rs = await healthLogBookModel.find({
      $and: [
        {
          "doctor._id": dataSearch.doctor,
        },
        {
          "date.month": regex.getMonth() + 2,
          "date.year": regex.getFullYear(),
        },
      ],
    });
    return rs;
  }
  async updateBloodPressure(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    exist.disMon.push(data.disMonItem);
    if (data.status_bloodPressure.status_type !== "NORMAL") {
      const messageDoctor = {
        title: "Cảnh báo sức khỏe",
        content: `Huyết áp của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_bloodPressure.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        category: "HEARTLOGBOOK",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: data._id,
        user: exist.doctor._id,
      };
      mailService.warning(
        exist.doctor.email,
        "Cảnh báo sức khỏe",
        `Huyết áp của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_bloodPressure.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        ""
      );
      noticeService.create(messageDoctor);
      exist.status_bloodPressure = data.status_bloodPressure;
    } else {
      exist.status_bloodPressure = null;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, exist, {
      new: true,
    });
    return rs;
  }
  async updateTemperature(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    exist.disMon.push(data.disMonItem);
    if (data.status_temperature.status_type !== "NORMAL") {
      const messageDoctor = {
        title: "Cảnh báo sức khỏe",
        content: `Nhiệt độ cơ thể của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_temperature.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        category: "HEARTLOGBOOK",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: data._id,
        user: exist.doctor._id,
      };
      mailService.warning(
        exist.doctor.email,
        "Cảnh báo sức khỏe",
        `Nhiệt độ cơ thể của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_temperature.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        ""
      );
      noticeService.create(messageDoctor);
      exist.status_temperature = data.status_temperature;
    } else {
      exist.status_temperature = null;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, exist, {
      new: true,
    });
    return rs;
  }
  async updateHeartRate(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }

    exist.disMon.push(data.disMonItem);
    if (data.status_heartRate.status_type !== "NORMAL") {
      const messageDoctor = {
        title: "Cảnh báo sức khỏe",
        content: `Nhịp tim của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_heartRate.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        category: "HEARTLOGBOOK",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: data._id,
        user: exist.doctor._id,
      };
      mailService.warning(
        exist.doctor.email,
        "Cảnh báo sức khỏe",
        `Nhịp tim của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_heartRate.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        ""
      );
      noticeService.create(messageDoctor);
      exist.status_heartRate = data.status_heartRate;
    } else {
      exist.status_heartRate = null;
    }

    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, exist, {
      new: true,
    });
    return rs;
  }
  async updateBMI(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    exist.disMon.push(data.disMonItem);
    if (data.status_bmi.status_type !== "NORMAL") {
      const messageDoctor = {
        title: "Cảnh báo sức khỏe",
        content: `Chỉ số BMI của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_bmi.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        category: "HEARTLOGBOOK",
        date: {
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        attached: data._id,
        user: exist.doctor._id,
      };
      mailService.warning(
        exist.doctor.email,
        "Cảnh báo sức khỏe",
        `Chỉ số BMI của bệnh nhân ${exist.patient.fullName} đang trong tình trạng ${data.status_bmi.message}. Bác sĩ hãy chú ý đến bệnh nhân này!!!`,
        ""
      );
      noticeService.create(messageDoctor);
      exist.status_bmi = data.status_bmi;
    } else {
      exist.status_bmi = null;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, exist, {
      new: true,
    });
    return rs;
  }
  async updateSymptom(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    exist.disMon.push(data.disMonItem);
    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, exist, {
      new: true,
    });
    return rs;
  }
}
module.exports = new HealthLogBookService();
