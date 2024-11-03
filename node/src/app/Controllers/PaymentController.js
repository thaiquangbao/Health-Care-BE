const moment = require("moment");
moment.tz.setDefault("Asia/Ho_Chi_Minh");
const emitter = require("../../config/Emitter/emitter");
const querystring = require("qs");
const crypto = require("crypto");
const paymentService = require("../Services/PaymentService");
class PaymentController {
  async payment(req, res) {
    try {
      const data = req.body;
      if (
        data.transferAmount === 200000 ||
        data.transferAmount === 10000
      ) {
        emitter.emit("payment-appointment-online", data);
      }
      if (
        data.transferAmount === 300000 ||
        data.transferAmount === 15000
      ) {
        emitter.emit("payment-appointment-offline", data);
      }
      if (
        data.transferAmount === 1350000 ||
        data.transferAmount === 2300000 ||
        data.transferAmount === 4000000 ||
        data.transferAmount === 20000
      ) {
        emitter.emit("payment-appointment-logbooks", data);
      }
      return res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async save(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.save(data);
      // if (payment === 2) {
      //   return res
      //     .status(400)
      //     .json("Không tìm thấy bệnh nhân!!!");
      // }
      // if (payment === 3) {
      //   return res
      //     .status(400)
      //     .json("Không tìm thấy bác sĩ!!!");
      // }
      // const accessToken = req.headers["accesstoken"];
      // const refreshToken = req.headers["refreshtoken"];
      // const token = {
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      // };
      return res.status(200).json(payment);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async update(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.update(data);
      if (payment === 0) {
        return res
          .status(400)
          .json("Không tìm thấy thông tin thanh toán");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getOne(req, res) {
    try {
      const id = req.params.id;
      const payment = await paymentService.getOne(id);
      if (payment === 0) {
        return res
          .status(400)
          .json("Không tìm thấy thông tin thanh toán");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getAll(req, res) {
    try {
      const payment = await paymentService.getAll();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async findByStatus(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.findByStatus(
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
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async findByStatusDoctor(req, res) {
    try {
      const data = req.body;
      const payment =
        await paymentService.findByStatusDoctor(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async findByDate(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.findByDate(data);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async findByDoctor(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.findByDoctor(
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
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async findByPatient(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.findByPatient(
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
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async findByCategory(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.findByCategory(
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
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async paymentForPatient(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.payForPatient(
        data
      );
      if (payment === 2) {
        return res
          .status(400)
          .json("Không tìm thấy bệnh nhân!!!");
      }
      if (payment === 0) {
        return res
          .status(400)
          .json("Không tìm thấy thông tin thanh toán!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async paymentForDoctor(req, res) {
    try {
      const data = req.body;
      const payment = await paymentService.payForDoctor(
        data
      );
      if (payment === 0) {
        return res
          .status(400)
          .json("Không tìm thấy thông tin thanh toán!!!");
      }
      if (payment === 2) {
        return res
          .status(400)
          .json("Không tìm thấy bác sĩ!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      return res
        .status(200)
        .json({ data: payment, token: token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}

module.exports = new PaymentController();
