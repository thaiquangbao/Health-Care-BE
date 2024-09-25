const doctorService = require("../Services/AuthService/DoctorService");
class DoctorController {
  async createDoctor(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.createDoctor(data);
      if (rs === 0) {
        return res
          .status(400)
          .json("Số điện thoại đã tồn tại!!!");
      }
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async updateDoctor(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.updateDoctor(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Bác sĩ không tồn tại!!!");
      }
      if (rs === 2) {
        return res
          .status(400)
          .json("Số điện thoại đã tồn tại!!!");
      }
      
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async getAllDoctor(req, res) {
    try {
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await Promise.all(
        await doctorService.getAllDoctor()
      );
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async getOneDoctor(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.getDoctorById(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Bác sĩ không tồn tại!!!");
      }
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async deleteDoctor(req, res) {
    try {
      const data = req.params;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.deleteDoctor(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bác sĩ!!!");
      }
      if (rs === 2) {
        return res
          .status(400)
          .json("Xóa hồ sơ bác sĩ không thành công!!!");
      }
      return res.status(200).json({
        data: "Xóa thành công!!!",
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async deleteManyDoctor(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      await doctorService.deleteManyDoctor(data);
      return res.status(200).json({
        data: "Xóa các bác sĩ thành công!!!",
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async updatePassWordDoctor(req, res) {
    try {
      const data = req.body;
      const { id } = req.params;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.updatePassWord(
        data,
        id
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Bác sĩ không tồn tại!!!");
      }
      if (rs === 2) {
        return res
          .status(400)
          .json("Mật khẩu cũ không đúng!!!");
      }
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async takePasswordDoctor(req, res) {
    try {
      const data = req.body;
      const rs = await doctorService.takePassWord(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Bác sĩ không tồn tại!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async updateDoctorImage(req, res) {
    try {
      const data = req.body;
      const image = req.file;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.updateImage(
        data,
        image
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Bác sĩ không tồn tại!!!");
      }
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async updateEmailDoctor(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await doctorService.updateEmail(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Bác sĩ không tồn tại!!!");
      }
      if (rs === 2) {
        return res
          .status(400)
          .json("Địa chỉ email đã tồn tại!!!");
      }
      
      return res.status(200).json({
        data: rs,
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
}
module.exports = new DoctorController();
