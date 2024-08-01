class DoctorResponse {
  async toDoctorAuth(doctor) {
    const data = {
      _id: doctor._id,
      fullName: doctor.fullName,
      passWord: doctor.passWord,
      email: doctor.email,
      sex: doctor.sex,
      phone: doctor.phone,
      address: doctor.address,
      passWord: doctor.passWord,
      role: doctor.role,
      processSignup: doctor.processSignup,
      image: doctor.image,
      dateOfBirth: doctor.dateOfBirth,
      specialize: doctor.specialize,
    };
    return data;
  }
}
module.exports = new DoctorResponse();
