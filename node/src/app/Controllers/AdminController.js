const adminService = require("../Services/AdminService");
class AdminController {
  async getAllAppointments(req, res) {
    try {
      const rs = await adminService.getAllAppointments();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAppointmentsWeek(req, res) {
    try {
      const rs = await adminService.getAppointmentWeek();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAppointmentsMonth(req, res) {
    try {
      const rs = await adminService.getAppointmentMonth();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAppointmentsYear(req, res) {
    try {
      const rs = await adminService.getAppointmentYear();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAllAppointHome(req, res) {
    try {
      const rs =
        await adminService.getAllAppointmentHomes();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAppointHomeWeek(req, res) {
    try {
      const rs =
        await adminService.getAppointmentHomesWeek();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAppointHomeMonth(req, res) {
    try {
      const rs =
        await adminService.getAppointmentHomesMonth();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAppointHomeYear(req, res) {
    try {
      const rs =
        await adminService.getAppointmentHomesYear();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getAllLogBooks(req, res) {
    try {
      const rs = await adminService.getLogBooksAll();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getLogBooksWeek(req, res) {
    try {
      const rs = await adminService.getLogBooksWeek();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getLogBooksMonth(req, res) {
    try {
      const rs = await adminService.getLogBooksMonth();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
  async getLogBooksYear(req, res) {
    try {
      const rs = await adminService.getLogBooksYear();
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }
}
module.exports = new AdminController();
