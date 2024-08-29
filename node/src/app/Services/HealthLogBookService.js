const healthLogBookModel = require("../models/healthLogBookModels");
const roomsService = require("./ChatService/RoomsService");
const messageService = require("./ChatService/MessagesService");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
class HealthLogBookService {
  async save(data) {
    const healthLogBook = new healthLogBookModel(data);
    return healthLogBook.save();
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
  async accepted(id) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    const updated = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "ACCEPTED",
          "status.message": "Bác sĩ đã đồng ý",
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
    await messageService.save(message);
    return updated;
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
    return rs;
  }
  async updateDoctor(data) {
    const exist = await healthLogBookModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          doctor: data.doctor,
          "status.status_type": "QUEUE",
          "status.message": "Đang chờ xác nhận",
        },
      },
      { new: true }
    );
    return rs;
  }
  async stopped(id) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(
      exist._id,
      {
        $set: {
          "status.status_type": "STOPPED",
          "status.message": "Đã dừng điều trị",
        },
      },
      { new: true }
    );
    return rs;
  }
  async update(data) {
    const exist = await healthLogBookModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await healthLogBookModel.findByIdAndUpdate(data._id.data, {
      new: true,
    });
    return rs;
  }
  async getAll() {
    return healthLogBookModel.find();
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
    const startOfWeek = moment().startOf("week").toDate();
    const endOfWeek = moment().endOf("week").toDate();
    const start = startOfWeek.getDate() + 1;
    const end = endOfWeek.getDate() + 1;
    const rs = await healthLogBookModel.find({
      $and: [
        { "doctor._id": data.doctor },
        { "date.day": { $gte: start, $lte: end } },
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
    const rs = await healthLogBookModel.findByIdAndUpdate(exist._id, exist, {
      new: true,
    });
    return rs;
  }
}
module.exports = new HealthLogBookService();
