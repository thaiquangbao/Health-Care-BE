const payPackModel = require("../models/payBackModels");
const payBackResponse = require("../Dtos/PayBack/PayBackResponse");
const userModels = require("../models/usersModels");
const noticeService = require("./NoticeService");
class PayBackService {
  async save(data) {
    const payBack = new payPackModel(data);
    return await payBack.save();
  }
  async update(data) {
    const exist = await payPackModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const result = await payPackModel.findByIdAndUpdate(
      data._id,
      data,
      { new: true }
    );
    return result;
  }
  async getOne(id) {
    const rs = await payPackModel.findById(id).lean();
    if (!rs) {
      return 0;
    }
    const user = await userModels.findById(rs.doctor_id);
    return payBackResponse.toPayBackResponse(rs, user);
  }
  async getAll() {
    const rs = await payPackModel.find().lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const user = await userModels.findById(
          item.doctor_id
        );
        return payBackResponse.toPayBackResponse(
          item,
          user
        );
      })
    );
    return result;
  }
  async getByDoctor(data) {
    const rs = await payPackModel
      .find({ doctor_id: data.doctor_id })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const user = await userModels.findById(
          item.doctor_id
        );
        return payBackResponse.toPayBackResponse(
          item,
          user
        );
      })
    );
    return result;
  }
  async getByService(data) {
    const rs = await payPackModel
      .find({
        $and: [
          { service_id: data.service_id },
          { doctor_id: data.doctor_id },
        ],
      })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const user = await userModels.findById(
          item.doctor_id
        );
        return payBackResponse.toPayBackResponse(
          item,
          user
        );
      })
    );
    return result;
  }
  async getByStatus(data) {
    const rs = await payPackModel
      .find({
        $and: [
          { "status.type": data.status_type },
          { doctor_id: data.doctor_id },
        ],
      })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const user = await userModels.findById(
          item.doctor_id
        );
        return payBackResponse.toPayBackResponse(
          item,
          user
        );
      })
    );
    return result;
  }
  async getByType(data) {
    const rs = await payPackModel
      .find({
        $and: [
          { type: data.type },
          { doctor_id: data.doctor_id },
        ],
      })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const user = await userModels.findById(
          item.doctor_id
        );
        return payBackResponse.toPayBackResponse(
          item,
          user
        );
      })
    );
    return result;
  }
  async requestStatus(data) {
    const result = await payPackModel.updateMany(
      {
        $and: [
          { doctor_id: data.doctor_id },
          {
            $or: [
              { "status.type": "REFUSE" },
              { "status.type": "AVAILABLE" },
            ],
          },
        ],
      },

      {
        "status.type": data.status.type,
        "status.messages": data.status.messages,
      }
    );
    const messageDoctor = {
      title: "Đã gửi yêu cầu nhận tiền thành công",
      content: `Bác sĩ đã gửi yêu cầu nhận tiền thành công. Hãy chờ Admin xác nhận nhé !!!`,
      category: "PAYBACK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: data.doctor_id,
      user: data.doctor_id,
    };
    noticeService.create(messageDoctor);
    return result;
  }
  async acceptStatus(data) {
    const result = await payPackModel.updateMany(
      {
        $and: [
          { doctor_id: data.doctor_id },
          { "status.type": data.status_type },
        ],
      },
      {
        "status.type": data.status.type,
        "status.messages": data.status.messages,
      }
    );
    const messageDoctor = {
      title: "Yêu cầu nhận tiền được chấp nhận",
      content: `Yêu cầu nhận tiền của bác sĩ đã được chấp thuận. Hãy chờ Admin chuyển tiền nhé !!!`,
      category: "PAYBACK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: data.doctor_id,
      user: data.doctor_id,
    };
    noticeService.create(messageDoctor);
    return result;
  }
  async completeStatus(data) {
    const result = await payPackModel.updateMany(
      {
        $and: [
          { doctor_id: data.doctor_id },
          { "status.type": data.status_type },
        ],
      },
      {
        "status.type": data.status.type,
        "status.messages": data.status.messages,
      }
    );
    const messageDoctor = {
      title: "Tiền đã được gửi thành công",
      content: `Tiền đã được gửi cho bác sĩ qua số tài khoản. Hãy kiểm tra tài khoản ngân hàng nhé !!!`,
      category: "PAYBACK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: data.doctor_id,
      user: data.doctor_id,
    };
    noticeService.create(messageDoctor);
    return result;
  }
  async refuseStatus(data) {
    const result = await payPackModel.updateMany(
      {
        $and: [
          { doctor_id: data.doctor_id },
          { "status.type": data.status_type },
        ],
      },
      {
        "status.type": data.status.type,
        "status.messages": data.status.messages,
        reason: data.reason,
      }
    );
    const messageDoctor = {
      title: "Yêu cầu nhận tiền bị từ chối",
      content: `Yêu cầu nhận tiền của bác sĩ bị từ chối.Lý do: ${data.reason}. Hãy liên hệ với Admin để biết thêm thông tin chi tiết !!!`,
      category: "PAYBACK",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: data.doctor_id,
      user: data.doctor_id,
    };
    noticeService.create(messageDoctor);
    return result;
  }
}
module.exports = new PayBackService();
