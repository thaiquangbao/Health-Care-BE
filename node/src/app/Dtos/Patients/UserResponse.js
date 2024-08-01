class UserResponse {
  async toUserAuth(user) {
    const data = {
      _id: user._id,
      fullName: user.fullName,
      passWord: user.passWord,
      email: user.email,
      sex: user.sex,
      phone: user.phone,
      address: user.address,
      passWord: user.passWord,
      role: user.role,
      processSignup: user.processSignup,
      dateOfBirth: user.dateOfBirth,
      image: user.image,
    };
    return data;
  }
}
module.exports = new UserResponse();
