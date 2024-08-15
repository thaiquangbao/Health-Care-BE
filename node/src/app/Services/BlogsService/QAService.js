const qaModel = require("../../models/blogs/QAModels");
class QAService {
  async save(data) {
    const newQA = new qaModel(data);
    return newQA.save();
  }
  async update(data) {
    const exist = await qaModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = qaModel.findByIdAndUpdate(data._id, data);
    return rs;
  }
  async getAll() {
    return await qaModel.find();
  }
  async getOne(id) {
    const rs = await qaModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async delete(id) {
    const exist = qaModel.findById(id);
    if (!exist) {
      return 0;
    }
    return qaModel.findByIdAndDelete(id);
  }
  async ownQA(data) {
    const rs = await qaModel.findOne({
      $and: [{ _id: data._id }, { patient: data.patient }],
    });
    if (!rs) {
      return 0;
    }
    return rs;
  }
}
module.exports = new QAService();
