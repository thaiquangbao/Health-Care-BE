class CustomerRequest {
  toCustomerAppointment(customer) {
    const data = {
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      sex: customer.sex,
      phone: customer.phone,
    };
    return data;
  }
}
module.exports = new CustomerRequest();
