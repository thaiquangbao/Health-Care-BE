const noticeService = require("../Services/NoticeService");
class NoticeController {
  async create(req, res) {
    try {
      const notice = noticeService.create(req.body);
      res.status(200).json(notice);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getAll(req, res) {
    try {
      const notices = await noticeService.getAll();
      res.status(200).json(notices);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getById(req, res) {
    try {
      const notice = await noticeService.getById(
        req.params.id
      );
      res.status(200).json(notice);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getByUser(req, res) {
    try {
      const notices = await noticeService.getByUser(
        req.params.id
      );
      res.status(200).json(notices);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async update(req, res) {
    try {
      const notice = await noticeService.update(req.body);
      res.status(200).json(notice);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}
module.exports = new NoticeController();
