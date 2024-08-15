const priceListService = require("../Services/AppointmentService/PriceListService");
class PriceListController {
  async create(req, res) {
    try {
      const dataPrice = req.body;
      const rs = await priceListService.create(dataPrice);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const dataPrice = req.body;
      const rs = await priceListService.update(dataPrice);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bản giá này!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async delete(req, res) {
    try {
      const id = req.params.id;
      const rs = await priceListService.delete(id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bản giá này!!!");
      }
      if (rs === 2) {
        return res
          .status(400)
          .json("Xóa không thành công bản giá này!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res
        .status(200)
        .json({ data: "Xóa thành công !!!", token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const dataPrice = req.params.id;
      const rs = await priceListService.getOne(dataPrice);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bản giá này!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);

      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await priceListService.getAll();
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
module.exports = new PriceListController();
