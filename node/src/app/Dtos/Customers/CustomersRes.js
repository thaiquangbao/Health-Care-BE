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
  async toCustomer(user) {
    const data = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      sex: user.sex,
      phone: user.phone,
      address: user.address,
      role: user.role,
      processSignup: user.processSignup,
      dateOfBirth: user.dateOfBirth,
      image: user.image,
      cccd: user.cccd,
      bank: user?.bank,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return data;
  }
}
module.exports = new CustomerRequest();
