const commentQAModel = require("../../models/blogs/commentQAModels");
const qaService = require("./QAService");
const doctorService = require("../AuthService/DoctorService");
const qaModel = require("../../models/blogs/QAModels");
class CommentQAService {
  async save(dateComment) {
    const exist = await qaService.getOne(dateComment.qa);
    if (!exist) {
      return 0;
    }
    const doctor = await doctorService.getDoctorById(
      dateComment.author
    );
    const valid = await qaModel.findOne({
      _id: exist._id,
      patient: dateComment.author,
    });
    if (!doctor && !valid) {
      return 2;
    }
    const newComment = new commentQAModel(dateComment);
    return await newComment.save();
  }
}
module.exports = new CommentQAService();
