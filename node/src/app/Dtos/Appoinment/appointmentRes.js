class AppointmentResponse {
  toAppointment(dataAp, dataPrice) {
    const data = {
      _id: dataAp._id,
      doctor_record_id: dataAp.doctor_record_id,
      patient: dataAp.patient,
      appointment_date: dataAp.appointment_date,
      status: dataAp.status,
      note: dataAp.note,
      status_message: dataAp.status_message,
      notificationSent: dataAp.notificationSent,
      sick: dataAp.sick,
      images: dataAp.images,
      healthRate: dataAp.healthRate,
      weight: dataAp.weight,
      bloodPressure: dataAp.bloodPressure,
      price_list: {
        _id: dataPrice._id,
        price: dataPrice.price,
        type: dataPrice.type,
      },
      height: dataAp.height,
      temperature: dataAp.temperature
    };
    return data;
  }
}
module.exports = new AppointmentResponse();
