const patientService = require("../Services/AuthService/PatientService");
class PatientController {
  async updatePatient(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await patientService.updatePatient(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Người dùng không tồn tại!!!");
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
  async getAllPatient(req, res) {
    try {
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await Promise.all(
        await patientService.getAllPatient()
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
  async getOnePatient(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await patientService.getPatientById(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Người dùng không tồn tại!!!");
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
  async deletePatient(req, res) {
    try {
      const data = req.params;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await patientService.deletePatient(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy người dùng !!!");
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
  async deleteManyPatient(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      await patientService.deleteManyPatient(data);
      return res.status(200).json({
        data: "Xóa các người dùng thành công!!!",
        token: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async updatePassWordPatient(req, res) {
    try {
      const data = req.body;
      const { id } = req.params;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await patientService.updatePassWord(
        data,
        id
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Người dùng không tồn tại!!!");
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
  async takePasswordPatient(req, res) {
    try {
      const data = req.body;
      const rs = await patientService.takePassWord(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Người dùng không tồn tại!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json("Lỗi hệ thống!!!");
    }
  }
  async updatePatientImage(req, res) {
    try {
      const data = req.body;
      const image = req.file;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await patientService.updateImage(
        data,
        image
      );
      if (rs === 0) {
        return res
          .status(404)
          .json("Người dùng không tồn tại!!!");
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
  async updateEmailPatient(req, res) {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const rs = await patientService.updateEmail(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Người dùng không tồn tại!!!");
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
module.exports = new PatientController();
