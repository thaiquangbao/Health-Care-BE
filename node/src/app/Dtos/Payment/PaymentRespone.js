class PaymentRespone {
  toPaymentDto(doctor, patient, payment) {
    const data = {
      _id: payment._id,
      doctor: {
        _id: doctor?._id,
        fullName: doctor?.fullName,
        email: doctor?.email,
        phone: doctor?.phone,
        bank: doctor?.bank,
      },
      patient: {
        _id: patient?._id,
        fullName: patient?.fullName,
        email: patient?.email,
        phone: patient?.phone,
        bank: patient?.bank,
      },
      namePayment: payment.namePayment,
      category: payment.category,
      status_take_money: payment.status_take_money,
      date: payment.date,
      status_payment: payment.status_payment,
      price: payment.price,
      description: payment.description,
      dateTake: payment.dateTake,
      beneficiaryAccount: payment.beneficiaryAccount,
      descriptionTake: payment.descriptionTake,
    };
    return data;
  }
  toPaymentPatientDto(doctor, patient, payment) {
    const data = {
      _id: payment._id,
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        bank: doctor?.bank,
      },
      patient: {
        _id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        bank: patient?.bank,
      },
      namePayment: payment.namePayment,
      category: payment.category,
      date: payment.date,
      dateTake: payment.dateTake,
      status_payment: payment.status_payment,
      price: payment.price,
      description: payment.description,
      descriptionTake: payment.descriptionTake,
      beneficiaryAccount: payment.beneficiaryAccount,
    };
    return data;
  }
  toPaymentDoctorDto(doctor, patient, payment) {
    const data = {
      _id: payment._id,
      doctor: {
        _id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        bank: doctor?.bank,
      },
      patient: {
        _id: patient._id,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        bank: patient?.bank,
      },
      namePayment: payment.namePayment,
      category: payment.category,
      date: payment.date,
      status_take_money: payment.status_take_money,
      price: payment.price,
      description: payment.description,
    };
    return data;
  }
}
module.exports = new PaymentRespone();
