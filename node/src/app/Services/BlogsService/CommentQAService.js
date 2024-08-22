const commentQAModel = require("../../models/blogs/commentQAModels");
const qaService = require("./QAService");
const doctorService = require("../AuthService/DoctorService");
const qaModel = require("../../models/blogs/QAModels");
const userModel = require("../../models/usersModels");
const commentDto = require("../../Dtos/Comment/CommentRes");
class CommentQAService {
  async save(dateComment) {
    const exist = await qaService.getOne(dateComment.qa);
    if (!exist) {
      return 0;
    }
    const newComment = new commentQAModel(dateComment);
    const rs = await newComment.save();
    return commentDto.toCommentRes(
      rs,
      await userModel.findOne({ _id: rs.author })
    );
  }
  async getByQA(qa) {
    const comments = await commentQAModel
      .find({ qa: qa })
      .lean();
    const rs = await Promise.all(
      comments.map(async (comment) => {
        const exist = await userModel.findById(
          comment.author
        );
        return commentDto.toCommentRes(comment, exist);
      })
    );

    return rs;
  }
  async getOne(id) {
    const rs = await commentQAModel.findById(id).lean();
    return commentDto.toCommentRes(
      rs,
      await userModel.findOne({ _id: rs.author })
    );
  }
  async getAll() {
    const comments = await commentQAModel.find().lean();
    const rs = await Promise.all(
      comments.map(async (comment) => {
        const exist = await userModel.findById(
          comment.author
        );
        return commentDto.toCommentRes(comment, exist);
      })
    );

    return rs;
  }
}
module.exports = new CommentQAService();
