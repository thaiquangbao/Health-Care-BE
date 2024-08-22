const commentService = require("../../Services/BlogsService/CommentQAService");
class CommentController {
  async save(req, res) {
    try {
      const rs = await commentService.save(req.body);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getByQA(req, res) {
    try {
      const rs = await commentService.getByQA(
        req.params.id
      );
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const rs = await commentService.getOne(req.params.id);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await commentService.getAll();
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
module.exports = new CommentController();
