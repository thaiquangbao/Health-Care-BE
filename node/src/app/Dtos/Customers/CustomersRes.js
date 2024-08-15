class CustomerRequest {
  toCustomerAppointment(doctor) {
    const data = {
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      sex: doctor.sex,
      phone: doctor.phone,
    };
    return data;
  }
}
module.exports = new CustomerRequest();
