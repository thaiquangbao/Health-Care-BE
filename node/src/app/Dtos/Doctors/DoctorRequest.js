class DoctorRequest {
  toDoctorRecord(doctor) {
    const data = {
      _id: doctor._id,
      fullName: doctor.fullName,
      email: doctor.email,
      sex: doctor.sex,
      phone: doctor.phone,
      image: doctor.image,
      specialize: doctor.specialize,
      pathological: doctor.pathological,
    };
    return data;
  }
}
module.exports = new DoctorRequest();
