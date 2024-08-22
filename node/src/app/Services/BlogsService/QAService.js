const qaModel = require("../../models/blogs/QAModels");
const qaDto = require("../../Dtos/QA/qaRes");
const userModel = require("../../models/usersModels");

class QAService {
  async save(data) {
    const newQA = new qaModel(data);
    return await newQA.save();
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
    const rs = await qaModel.find().lean();
    const data = await Promise.all(
      rs.map(async (item) => {
        const exist = await userModel.findById(
          item.patient
        );
        return qaDto.toQAResponse(item, exist);
      })
    );
    return data;
  }
  async getOne(id) {
    const rs = await qaModel.findById(id).lean();

    if (!rs) {
      return 0;
    }
    const exist = await userModel.findById(rs.patient);
    return qaDto.toQAResponse(rs, exist);
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
  async updateView(id) {
    const exist = await qaModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await qaModel.findByIdAndUpdate(exist._id, {
      views: exist.views + 1,
    });
    return rs;
  }
  async updateComment(id) {
    const exist = await qaModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await qaModel.findByIdAndUpdate(
      exist._id,
      {
        comment: exist.comment + 1,
      },
      { new: true }
    );
    return rs;
  }
  async updateLike(data) {
    const exist = await qaModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await qaModel.findByIdAndUpdate(
      exist._id,
      {
        $push: { like: data.patient },
      },
      { new: true }
    );
    return rs;
  }
}
module.exports = new QAService();
