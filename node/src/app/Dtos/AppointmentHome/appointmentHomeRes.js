const e = require("express");

class AppointmentHomeResponse {
  toAppointmentHome(dataAp, dataPrice, doctorData) {
    const data = {
      _id: dataAp._id,
      doctor_record_id: dataAp.doctor_record_id,
      patient: dataAp.patient,
      appointment_date: dataAp.appointment_date,
      status: {
        status_type: dataAp.status.status_type,
        message: dataAp.status.message,
      },
      doctor: doctorData,
      note: dataAp.note,
      notificationSent: dataAp.notificationSent,
      sick: dataAp.sick,
      price_list: {
        _id: dataPrice._id,
        price: dataPrice.price,
        type: dataPrice.type,
      },
      equipment: dataAp.equipment,
      timeLimit: {
        day: dataAp.timeLimit.day,
        month: dataAp.timeLimit.month,
        year: dataAp.timeLimit.year,
        time: dataAp.timeLimit.time,
      },
      processAppointment: dataAp.processAppointment,
    };
    return data;
  }
}
module.exports = new AppointmentHomeResponse();
