class PatientRequest {
  toPatientAppointment(doctor) {
    const data = {
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      sex: doctor.sex,
      phone: doctor.phone,
      image: doctor.image,
    };
    return data;
  }
}
module.exports = new PatientRequest();
