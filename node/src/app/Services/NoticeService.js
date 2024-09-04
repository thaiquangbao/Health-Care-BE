const notificationModel = require("../models//notificationModels");
const emitter = require("../../config/Emitter/emitter");
class NoticeService {
  create(data) {
    const notice = new notificationModel(data);
    const result = notice.save();
    emitter.emit("notice.create", result);
    return result;
  }
  async getAll() {
    return await notificationModel.find();
  }
  async getById(id) {
    const rs = await notificationModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async getByUser(id) {
    return await notificationModel.find({ user: id });
  }
  async update(data) {
    const exist = await notificationModel.findById(
      data._id
    );
    if (!exist) {
      return 0;
    }
    const rs = await notificationModel.findByIdAndUpdate(
      data._id,
      { $set: { seen: data.seen } },
      { new: true }
    );
    return rs;
  }
}
module.exports = new NoticeService();
