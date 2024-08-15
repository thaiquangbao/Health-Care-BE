const sickService = require("../Services/AppointmentService/SickService");
class SickController {
  async save(req, res) {
    try {
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      const rs = await sickService.save(req.body);
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const rs = await sickService.update(req.body);
      if (rs == 0) {
        return res
          .status(404)
          .json("Không tìm thấy bệnh này !!!");
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
      const rs = await sickService.delete(req.params.id);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      if (rs == 0) {
        return res
          .status(404)
          .json("Không tìm thấy bệnh này !!!");
      }
      return res
        .status(200)
        .json({ data: "Xóa bệnh thành công !!!", token });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const rs = await sickService.getOne(req.params.id);
      // const accessToken = req.headers["accesstoken"];
      // const refreshToken = req.headers["refreshtoken"];
      // const token = { accessToken, refreshToken };
      if (rs == 0) {
        return res
          .status(404)
          .json("Không tìm thấy bệnh này !!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async findAll(req, res) {
    try {
      const rs = await sickService.findAll();
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async updateImage(req, res) {
    try {
      const data = req.body;
      const image = req.file;
      const rs = await sickService.updateImage(data, image);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bệnh này!!!");
      }
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async deleteAll(req, res) {
    try {
      const rs = await sickService.deleteAll(req.body);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res
        .status(200)
        .json({ data: "Xóa bệnh thành công!!!", token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
module.exports = new SickController();
