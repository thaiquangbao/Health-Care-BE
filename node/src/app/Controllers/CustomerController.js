const customerService = require("../Services/CustomerService/CustomerService");
class CustomerController {
  async create(req, res) {
    try {
      const dataCustomer = req.body;
      const customer = await customerService.create(
        dataCustomer
      );
      if (customer === 0) {
        return res
          .status(404)
          .json("Không tìm thấy hồ sơ bác sĩ!!!");
      }
      if (customer === 2) {
        return res.status(400).json("Email đã tồn tại!!!");
      }
      return res.status(200).json(customer);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.String());
    }
  }
}
module.exports = new CustomerController();
