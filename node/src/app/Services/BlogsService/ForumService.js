const forumModel = require("../../models/blogs/forumModels");
class ForumService {
  async save(data) {
    const newForum = new forumModel(data);
    return await newForum.save();
  }
  async update(data) {
    const exist = await forumModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await forumModel.findByIdAndUpdate(
      exist._id,
      data,
      { new: true }
    );
    return rs;
  }
  async delete(id) {
    const exist = await forumModel.findById(id);
    if (!exist) {
      return 0;
    }
    await forumModel.findByIdAndDelete(id);
    return 1;
  }
  async getAll() {
    return await forumModel.find();
  }
  async getOne(id) {
    const exist = await forumModel.findById(id);
    if (!exist) {
      return 0;
    }
    return exist;
  }
  async getForumsByCategory(data) {
    const rs = await forumModel.find({
      category: data.category,
    });
    return rs;
  }
  async getByDoctor(id) {
    const rs = await forumModel.find({
      "author._id": id,
    });
    return rs;
  }
  async addViews(id) {
    const exist = await forumModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await forumModel.findByIdAndUpdate(
      exist._id,
      { views: exist.views + 1 },
      { new: true }
    );
    return rs;
  }
  async addLikes(data) {
    const exist = await forumModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await forumModel.findByIdAndUpdate(
      exist._id,
      { $push: { like: data.patient } },
      { new: true }
    );
    return rs;
  }
}
module.exports = new ForumService();
