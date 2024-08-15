class MedicalRecordDto {
  toDoctor(doctor) {
    const data = {
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
    };
    return data;
  }
  toPatient(patient) {
    const data = {
      _id: patient._id,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      sex: patient.sex,
      phone: patient.phone,
    };
    return data;
  }
}
module.exports = new MedicalRecordDto();
