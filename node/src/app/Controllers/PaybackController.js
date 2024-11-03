const payBackService = require("../Services/PayBackService");
const emitter = require("../../config/Emitter/emitter");
class PaybackController {
  async save(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.save(data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async update(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.update(data);
      if (result === 0) {
        return res
          .status(404)
          .json(
            "Không tìm thấy thông tin tinh lương này!!!"
          );
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const result = await payBackService.getOne(id);
      if (result === 0) {
        return res
          .status(404)
          .json(
            "Không tìm thấy thông tin tinh lương này!!!"
          );
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAll(req, res) {
    try {
      const result = await payBackService.getAll();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getByDoctor(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.getByDoctor(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getByService(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.getByService(
        data
      );
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getByStatus(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.getByStatus(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getByType(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.getByType(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async requestStatus(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.requestStatus(
        data
      );

      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      emitter.emit("request-status", data);
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async acceptStatus(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.acceptStatus(
        data
      );

      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      emitter.emit("accept-status", result);
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async completeStatus(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.completeStatus(
        data
      );

      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      emitter.emit("complete-status", result);
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async refuseStatus(req, res) {
    try {
      const data = req.body;
      const result = await payBackService.refuseStatus(
        data
      );

      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      emitter.emit("refuse-status", result);
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
module.exports = new PaybackController();
