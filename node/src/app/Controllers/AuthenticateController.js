const authService = require("../Services/AuthService/AuthenticateService");
class AuthenticateController {
  async signup(req, res) {
    try {
      const data = req.body;
      const result = await authService.signupAuth(data);
      if (result === 0) {
        return res
          .status(400)
          .json(
            "Số điện thoại đã tồn tại trong hệ thống!!!"
          );
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi máy chủ!!!");
    }
  }
  async updateProcessSignup(req, res) {
    try {
      const data = req.body;
      const result = await authService.updateProcessSignup(
        data
      );
      if (result === 0) {
        return res
          .status(404)
          .json("Số điện thoại không khả dụng!!!");
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi máy chủ!!!");
    }
  }
  async loginAuth(req, res) {
    try {
      const data = req.body;
      const result = await authService.loginAuth(data);
      if (result === 0) {
        return res
          .status(401)
          .json("Tài khoản hoặc mật khẩu không đúng!!!");
      }
      if (result === 2) {
        return res
          .status(401)
          .json("Không được quyền truy cập vào!!!");
      }
      if (result === 3) {
        return res
          .status(401)
          .json("Tài khoản hoặc mật khẩu không đúng!!!");
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi máy chủ!!!");
    }
  }
  async loginAdmin(req, res) {
    try {
      const data = req.body;
      const result = await authService.loginAdmin(data);
      if (result === 0) {
        return res
          .status(401)
          .json("Tài khoản hoặc mật khẩu không đúng!!!");
      }
      if (result === 2) {
        return res
          .status(401)
          .json("Không được quyền truy cập vào!!!");
      }
      if (result === 3) {
        return res
          .status(401)
          .json("Tài khoản hoặc mật khẩu không đúng!!!");
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi máy chủ!!!");
    }
  }
  async generateToken(req, res) {
    try {
      const data = req.body;
      const result = await authService.generateToken(data);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống !!!");
    }
  }
  async generateTokenZego(req, res) {
    try {
      const data = req.body;
      const result = await authService.generateToken(data);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống !!!");
    }
  }
  async getUserByToken(req, res) {
    try {
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const data = { accessToken, refreshToken };
      const result = await authService.getUserByToken(data);
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json("Phiên đăng nhập hết hạn !!!");
    }
  }
  async geAllUser(req, res) {
    try {
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await authService.getAllUSer();
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async checkExistAuth(req, res) {
    try {
      const data = req.body;
      const result = await authService.checkAuth(data);
      if (result === 0) {
        return res
          .status(404)
          .json("Số điện thoại không tồn tại!!!");
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
}
module.exports = new AuthenticateController();
