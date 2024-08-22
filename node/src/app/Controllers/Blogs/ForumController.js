const forumService = require("../../Services/BlogsService/ForumService");
class ForumController {
  async create(req, res) {
    try {
      const rs = await forumService.save(req.body);
      // const accessToken = req.headers["accesstoken"];
      // const refreshToken = req.headers["refreshtoken"];
      // const token = { accessToken, refreshToken };
      // return res.status(200).json({ data: rs, token });
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async update(req, res) {
    try {
      const rs = await forumService.update(req.body);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy cẩm nang!!!");
      }

      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async delete(req, res) {
    try {
      const data = req.params.id;
      const rs = await forumService.delete(data);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy cẩm nang!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({
        data: "Xóa thành công cẩm nang !!!",
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await forumService.getAll();
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getOne(req, res) {
    try {
      const data = req.params.id;
      const rs = await forumService.getOne(data);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getByCategory(req, res) {
    try {
      const rs = await forumService.getForumsByCategory(
        req.body
      );
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async getByDoctor(req, res) {
    try {
      const data = req.params.id;
      const rs = await forumService.getByDoctor(data);
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async addViews(req, res) {
    try {
      const data = req.params.id;
      const rs = await forumService.addViews(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy cẩm nang!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
  async addLikes(req, res) {
    try {
      const data = req.body;
      const rs = await forumService.addLikes(data);
      if (rs === 0) {
        return res
          .status(404)
          .json("Không tìm thấy cẩm nang!!!");
      }
      return res.status(200).json(rs);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}
module.exports = new ForumController();
