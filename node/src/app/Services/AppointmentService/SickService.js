const sickModel = require("../../models/sickModels");
const uploadToS3 = require("../../../config/AWS/S3");
class SickService {
  async save(dataSick) {
    const newSick = new sickModel(dataSick);
    return newSick.save();
  }
  async update(dataSick) {
    const exist = await sickModel.findById(dataSick._id);
    if (!exist) {
      return 0;
    }
    const rs = await sickModel.findByIdAndUpdate(
      dataSick._id,
      dataSick,
      {
        new: true,
      }
    );
    return rs;
  }
  async delete(id) {
    const exist = await sickModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await sickModel.findByIdAndDelete(id);
    return rs;
  }
  async getOne(id) {
    const rs = await sickModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async findAll() {
    return sickModel.find();
  }
  async updateImage(dataSick, image) {
    const exist = await sickModel.findById(dataSick._id);
    if (!exist) {
      return 0;
    }
    const url = await uploadToS3(
      `image_${Date.now().toString()}_${
        image.originalname.split(".")[0]
      }`,
      image.buffer,
      image.mimetype
    );
    image = url.url;
    const rs = await sickModel.findByIdAndUpdate(
      dataSick._id,
      { $set: { image: image } },
      {
        new: true,
      }
    );
    return rs;
  }
  async deleteAll(data) {
    const sicks = await sickModel.deleteMany({
      _id: { $in: data.ids },
    });
    return 1;
  }
}
module.exports = new SickService();
