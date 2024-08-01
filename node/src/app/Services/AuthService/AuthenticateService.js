const userModel = require("../../models/usersModels");
const passWordUntil = require("../../../untill/PassWordUntills");
const jwtService = require("./JWTService");
const userResponse = require("../../Dtos/Patients/UserResponse");
const doctorResponse = require("../../Dtos/Doctors/DoctorResponse");
const jwt = require("jsonwebtoken");
class AuthenticateService {
  async signupAuth(dataUser) {
    const existUser = await userModel.findOne({
      phone: dataUser.phone,
    });
    if (existUser) {
      return 0;
    }
    const passWord = await passWordUntil.hashPassword(
      dataUser.passWord
    );
    dataUser.role = "USER";
    dataUser.processSignup = 1;
    const newUser = new userModel({
      ...dataUser,
      passWord,
    });
    await newUser.save();
    return await userResponse.toUserAuth(newUser);
  }
  async updateProcessSignup(dataUser) {
    const existUser = await userModel.findOne({
      phone: dataUser.phone,
    });
    if (!existUser) {
      return 0;
    }
    const updated = await userModel.findByIdAndUpdate(
      existUser._id,
      dataUser,
      { new: true }
    );
    return await userResponse.toUserAuth(updated);
  }
  async loginAuth(dataUser) {
    const existUser = await userModel.findOne({
      phone: dataUser.userName,
    });
    if (!existUser) {
      return 0;
    }
    const isMatch = await passWordUntil.comparePasswords(
      dataUser.passWord,
      existUser.passWord
    );
    if (!isMatch) {
      return 3;
    }
    const token = await jwtService.generateTokens({
      _id: existUser._id,
    });
    if (existUser.role.match("USER")) {
      const user = await userResponse.toUserAuth(existUser);
      return { data: user, token };
    } else if (existUser.role.match("DOCTOR")) {
      const doctor = await doctorResponse.toDoctorAuth(
        existUser
      );
      return { data: doctor, token };
    } else {
      return 2;
    }
  }
  async loginAdmin(dataAdmin) {
    const existAdmin = await userModel.findOne({
      phone: dataAdmin.userName,
    });
    if (!existAdmin) {
      return 0;
    }
    const isMatch = await passWordUntil.comparePasswords(
      dataAdmin.passWord,
      existAdmin.passWord
    );
    if (!isMatch) {
      return 3;
    }
    if (!existAdmin.role.match("ADMIN")) {
      return 2;
    }
    const token = await jwtService.generateTokens({
      _id: existAdmin._id,
    });
    const admin = await userResponse.toUserAuth(existAdmin);
    return { data: admin, token };
  }
  async generateToken(data) {
    return await jwtService.generateTokens({
      _id: data._id,
    });
  }
  async getAuthData(user) {
    if (user.role.match("USER")) {
      return await userResponse.toUserAuth(user);
    } else if (user.role.match("DOCTOR")) {
      return await doctorResponse.toDoctorAuth(user);
    } else {
      return await userResponse.toUserAuth(user);
    }
  }
  async getUserByToken(data) {
    const { accessToken, refreshToken } = data;

    try {
      // Kiểm tra và giải mã Access Token
      jwt.verify(accessToken, process.env.SECRETKEY);
      const decodedAccess = jwt.decode(
        accessToken,
        process.env.SECRETKEY
      );
      const user = await userModel.findById(
        decodedAccess._id
      );

      return {
        data: await this.getAuthData(user),
        token: { accessToken, refreshToken },
      };
    } catch (error) {
      // Khi Access Token hết hạn, kiểm tra Refresh Token
      try {
        jwt.verify(refreshToken, process.env.SECRETKEY);
        const decodedRefresh = jwt.decode(
          refreshToken,
          process.env.SECRETKEY
        );

        const expR = decodedRefresh.exp * 1000;
        const currentTimestamp = new Date().getTime();
        const user = await userModel.findById(
          decodedRefresh._id
        );
        const newTokens = await jwtService.generateTokens(
          { _id: user._id },
          `${(expR - currentTimestamp) / 1000}s`
        );

        return {
          data: await this.getAuthData(user),
          token: newTokens,
        };
      } catch (error2) {
        // console.log(error2);
        return "Phiên đăng nhập hết hạn!!!";
      }
    }
  }
  async getAllUSer() {
    const users = await userModel.find();
    return users;
  }
}
module.exports = new AuthenticateService();
