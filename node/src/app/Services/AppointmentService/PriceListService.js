const priceListsModel = require("../../models/priceListModels");
const sickModel = require("../../models/sickModels");
const priceListDto = require("../../Dtos/PriceList/priceListRes");
class PriceListService {
  async create(data) {
    const dataPrice = new priceListsModel(data);
    const result = await dataPrice.save();
    return result;
  }
  async update(data) {
    const exist = await priceListsModel.findById(data._id);
    if (!exist) {
      return 0;
    }
    const rs = await priceListsModel.findByIdAndUpdate(
      exist._id,
      data,
      { new: true }
    );
    return rs;
  }
  async delete(id) {
    const exist = await priceListsModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await priceListsModel.findByIdAndDelete(id);
    if (!rs) {
      return 2;
    }
    return rs;
  }
  async getOne(data) {
    const rs = await priceListsModel.findById(data);

    if (!rs) {
      return 0;
    }
    return rs;
  }
  async getAll() {
    const rs = await priceListsModel.find();

    return rs;
  }
}
module.exports = new PriceListService();
