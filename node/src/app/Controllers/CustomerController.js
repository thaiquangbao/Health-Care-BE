const customerService = require("../Services/CustomerService/CustomerService");
const emitter = require("../../config/Emitter/emitter");
class CustomerController {
  async create(req, res) {
    try {
      const dataCustomer = req.body;
      const customer = await customerService.create(dataCustomer);
      if (customer === 0) {
        return res.status(404).json("Không tìm thấy hồ sơ bác sĩ!!!");
      }
      if (customer === 2) {
        return res.status(404).json("Không tìm thấy người dùng!!!");
      }
      emitter.emit("send-notice-customer.submit", customer);
      return res.status(200).json(customer);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
  async createCustomer(req, res) {
    try {
      const dataCustomer = req.body;
      const customer = await customerService.createCustomer(dataCustomer);
      if (customer === 2) {
        return res.status(400).json("Email đã tồn tại!!!");
      }
      return res.status(200).json(customer);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
  async getAllCustomer(req, res) {
    try {
      const customer = await customerService.getAllCustomer();

      return res.status(200).json(customer);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
  async deleteCustomer(req, res) {
    try {
      const id = req.params.id;
      const rs = await customerService.deleteOneCustomer(id);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      if (rs === 0) {
        return res.status(404).json("Không tìm thấy khách vãn lai này !!!");
      }
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.message);
    }
  }
}
module.exports = new CustomerController();
