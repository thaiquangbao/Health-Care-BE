class PayBackResponse {
  toPayBackResponse(payBack, doctor) {
    const data = {
      _id: payBack._id,
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        bank: doctor?.bank,
      },
      type: payBack.type,
      service_id: payBack.service_id,
      status: payBack.status,
      price: payBack.price,
      date: payBack.date,
    };
    return data;
  }
}
module.exports = new PayBackResponse();
