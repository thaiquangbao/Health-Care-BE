const paymentModel = require("../models/paymentModels");
const userModel = require("../models/usersModels");
const paymentDto = require("../Dtos/Payment/PaymentRespone");
const noticeService = require("./NoticeService");
class PaymentService {
  async save(paymentData) {
    // const patient = await userModel.findOne({
    //   $and: [
    //     { _id: paymentData.patient_id },
    //     { role: "USER" },
    //   ],
    // });
    // const doctor = await userModel.findOne({
    //   $and: [
    //     { _id: paymentData.doctor_id },
    //     { role: "DOCTOR" },
    //   ],
    // });
    // if (!patient) {
    //   return 2;
    // }
    // if (!doctor) {
    //   return 3;
    // }
    const payment = new paymentModel(paymentData);
    await payment.save();
    return payment;
  }
  async update(paymentData) {
    const exist = await paymentModel.findById(
      paymentData._id
    );
    if (!exist) {
      return 0;
    }
    const result = await paymentModel.findByIdAndUpdate(
      paymentData._id,
      paymentData,
      { new: true }
    );
    return result;
  }
  async getOne(id) {
    const exist = await paymentModel.findById(id).lean();
    if (!exist) {
      return 0;
    }
    const patient = await userModel.findOne({
      $and: [{ _id: exist.patient_id }, { role: "USER" }],
    });
    const doctor = await userModel.findOne({
      $and: [{ _id: exist.doctor_id }, { role: "DOCTOR" }],
    });

    return paymentDto.toPaymentDto(doctor, patient, exist);
  }
  async getAll() {
    const rs = await paymentModel.find().lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            {
              $or: [{ role: "USER" }, { role: "CUSTOMER" }],
            },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async findByStatus(paymentData) {
    const rs = await paymentModel
      .find({ "status_payment.type": paymentData.type })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            { role: "USER" },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async findByStatusDoctor(paymentData) {
    const rs = await paymentModel
      .find({ "status_take_money.type": paymentData.type })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            { role: "USER" },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async findByDate(paymentData) {
    const rs = await paymentModel.find({
      "date.day": paymentData.day,
      "date.month": paymentData.month,
      "date.year": paymentData.year,
    });
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            { role: "USER" },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async findByDoctor(paymentData) {
    const rs = await paymentModel
      .find({ doctor_id: paymentData.doctor_id })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            { role: "USER" },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async findByPatient(paymentData) {
    const rs = await paymentModel
      .find({ patient_id: paymentData.patient_id })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            { role: "USER" },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async findByCategory(paymentData) {
    const rs = await paymentModel
      .find({ category: paymentData.category })
      .lean();
    const result = await Promise.all(
      rs.map(async (item) => {
        const patient = await userModel.findOne({
          $and: [
            { _id: item.patient_id },
            { role: "USER" },
          ],
        });
        const doctor = await userModel.findOne({
          $and: [
            { _id: item.doctor_id },
            { role: "DOCTOR" },
          ],
        });
        return paymentDto.toPaymentDto(
          doctor,
          patient,
          item
        );
      })
    );
    return result;
  }
  async payForPatient(paymentData) {
    const exist = await paymentModel.findById(
      paymentData._id
    );
    if (!exist) {
      return 0;
    }
    const patient = await userModel.findOne({
       _id: exist.patient_id 
    });

    if (!patient) {
      return 2;
    }
    const result = await paymentModel.findByIdAndUpdate(
      paymentData._id,
      paymentData,
      { new: true }
    );
    const messagePatient = {
      title: "Hoàn tiền đặt khám",
      content: `Chi phí đặt  ${
        result.namePayment === "APPOINTMENT"
          ? "khám trực tuyến"
          : "theo dõi sức khỏe"
      } của bạn đã được hoàn trả, hãy kiểm tra tài khoản ngân hàng nhé. Bấm vào đây để xem thông tin cho tiết!!!`,
      category: "PAYMENT",
      date: {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
      attached: result._id,
      user: result.patient_id,
    };
    noticeService.create(messagePatient);
    return result;
  }
  async payForDoctor(paymentData) {
    const exist = await paymentModel.findById(
      paymentData._id
    );
    if (!exist) {
      return 0;
    }
    const doctor = await userModel.findOne({
      $and: [{ _id: exist.doctor_id }, { role: "DOCTOR" }],
    });

    if (!doctor) {
      return 2;
    }
    const result = await paymentModel.findByIdAndUpdate(
      paymentData._id,
      paymentData,
      { new: true }
    );
    return result;
  }
}
module.exports = new PaymentService();
