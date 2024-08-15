const customerModel = require("../../models/customerModel");
const userModel = require("../../models/usersModels");
const appointmentModels = require("../../models/appointmentModels");
const appointmentService = require("../AppointmentService/AppointmentService");
const customerReq = require("../../Dtos/Customers/CustomersReq");
const doctorRecordModel = require("../../models/doctorRecordModel");
class CustomerService {
  async create(dataCustomer) {
    const existRecord = await doctorRecordModel.findById(
      dataCustomer.doctor_record_id
    );
    if (!existRecord) {
      return 0;
    }
    const exist = await userModel.findOne({
      phone: dataCustomer.patient.phone,
    });
    if (exist) {
      const appointmentC = new appointmentModels(
        dataCustomer
      );
      appointmentC.patient = exist;
      appointmentC.doctor_record_id = existRecord._id;
      await appointmentC.save();
      return appointmentC;
    } else {
      const existCustomer = await userModel.findOne({
        $and: [
          { phone: dataCustomer.patient.phone },
          { role: "CUSTOMER" },
        ],
      });
      if (existCustomer) {
        const appointment = new appointmentModels(
          dataCustomer
        );
        appointment.doctor_record_id = existRecord._id;
        dataCustomer.patient =
          customerReq.toCustomerAppointment(existCustomer);
        return await appointment.save();
      }

      const existEmail = await userModel.findOne({
        email: dataCustomer.patient.email,
      });
      if (existEmail) {
        return 2;
      }

      const customer = new userModel(dataCustomer.patient);
      customer.role = "CUSTOMER";
      customer.image =
        "https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0";
      const dataSaved = await customer.save();

      const appointment = new appointmentModels(
        dataCustomer
      );
      appointment.doctor_record_id = existRecord._id;
      dataCustomer.patient =
        customerReq.toCustomerAppointment(dataSaved);
      return await appointment.save();
    }
  }
}
module.exports = new CustomerService();
