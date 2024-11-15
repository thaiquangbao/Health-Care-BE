const doctorSuggestService = require("../Services/DoctorSuggestService");
class DoctorSuggestController {
  save = async (req, res) => {
    try {
      const data = req.body;
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      const result = await doctorSuggestService.save(data);
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
  findAll = async (req, res) => {
    try {
      const result = await doctorSuggestService.findAll();
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
  remove = async (req, res) => {
    try {
      const doctor_record_id = req.params.id;
      const result = await doctorSuggestService.remove(
        doctor_record_id
      );
      if (result === 0) {
        return res
          .status(404)
          .json(
            "Bác sĩ không tồn tại trong danh sách đề xuất"
          );
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
  findById = async (req, res) => {
    try {
      const doctor_record_id = req.params.id;
      const result = await doctorSuggestService.findById(
        doctor_record_id
      );
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
  update = async (req, res) => {
    try {
      const data = req.body;
      const result = await doctorSuggestService.update(
        data
      );
      if (result === 0) {
        return res
          .status(404)
          .json(
            "Bác sĩ không tồn tại trong danh sách đề xuất"
          );
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res
        .status(200)
        .json({ data: result, token: token });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  };
}
module.exports = new DoctorSuggestController();
