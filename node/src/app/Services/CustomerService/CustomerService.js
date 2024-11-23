const customerModel = require("../../models/customerModel");
const userModel = require("../../models/usersModels");
const appointmentModels = require("../../models/appointmentModels");
const appointmentService = require("../AppointmentService/AppointmentService");
const customerReq = require("../../Dtos/Customers/CustomersReq");
const doctorRecordModel = require("../../models/doctorRecordModel");
const noticeService = require("../NoticeService");
const customerRes = require("../../Dtos/Customers/CustomersRes");
class CustomerService {
  async create(dataCustomer) {
    const existRecord = await doctorRecordModel.findById(
      dataCustomer.doctor_record_id
    );
    if (!existRecord) {
      return 0;
    }
    const existPatient = await userModel.findOne({
      phone: dataCustomer.patient.phone,
    });

    if (!existPatient) {
      return 2;
    }
    dataCustomer.patient = customerReq.toCustomerAppointment(existPatient);
    const appointment = new appointmentModels(dataCustomer);
    appointment.doctor_record_id = existRecord._id;
    await appointment.save();
    const messageDoctor = {
      title: "Đặt lịch hẹn",
      content: `Bác sĩ có lịch đặt hẹn vào lúc ${dataCustomer.appointment_date.time} ngày ${dataCustomer.appointment_date.day}/${dataCustomer.appointment_date.month}/${dataCustomer.appointment_date.year}. Bấm vào để xem thông tin chi tiết!!!`,
      category: "APPOINTMENT",
      date: {
        day: dataCustomer.appointment_date.day,
        month: dataCustomer.appointment_date.month,
        year: dataCustomer.appointment_date.year,
      },
      attached: appointment._id,
      user: existRecord.doctor._id,
    };
    noticeService.create(messageDoctor);

    return appointment;
  }
  async createCustomer(dataCustomer) {
    const exist = await userModel.findOne({
      phone: dataCustomer.patient.phone,
    });
    if (exist) {
      return { user: exist, role: "USER" };
    }
    const existCustomer = await userModel.findOne({
      $and: [{ phone: dataCustomer.patient.phone }, { role: "CUSTOMER" }],
    });
    if (existCustomer) {
      return { user: existCustomer, role: "CUSTOMER" };
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
    return { user: dataSaved, role: "NEW" };
  }
  async getAllCustomer() {
    const rs = await userModel.find({ role: "CUSTOMER" }).lean();
    rs.map((item) => {
      return customerRes.toCustomer(item);
    });
    return rs;
  }
  async deleteOneCustomer(id) {
    const exist = await userModel.findById(id);
    if (!exist) {
      return 0;
    }
    const rs = await userModel.findByIdAndDelete(id);
    return rs;
  }
}
module.exports = new CustomerService();
