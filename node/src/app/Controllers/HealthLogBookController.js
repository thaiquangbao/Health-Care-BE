const healthBookService = require("../Services/HealthLogBookService");
class HealthLogBookController {
  async save(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const result = await healthBookService.save(data);
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: result, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByDoctor(req, res) {
    try {
      const data = req.params.id;
      const rs = await healthBookService.findByDoctor(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByPatient(req, res) {
    try {
      const data = req.params.id;
      const rs = await healthBookService.findByPatient(
        data
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async accepted(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.accepted(data._id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch khám!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const data = req.params.id;
      const rs = await healthBookService.getOne(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch khám!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async rejected(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.rejected(data._id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch khám!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async updateDoctor(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.updateDoctor(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch khám!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async stopped(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.stopped(data._id);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch khám!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.update(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy lịch khám!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await healthBookService.getAll();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByDay(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.findByDay(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByNextDay(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.findByNextDay(
        data
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByWeek(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.findByWeak(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByNextWeek(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.findByNextWeek(
        data
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByMonth(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.findByMonth(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async findByNextMonth(req, res) {
    try {
      const data = req.body;
      const rs = await healthBookService.findByNextMonth(
        data
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
module.exports = new HealthLogBookController();
