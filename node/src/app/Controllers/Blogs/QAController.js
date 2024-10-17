const qaService = require("../../Services/BlogsService/QAService");
class PostController {
  async createQA(req, res) {
    try {
      const rs = await qaService.save(req.body);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getOne(req, res) {
    try {
      const rs = await qaService.getOne(req.params.id);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy bài đăng!!!");
      }
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getAll(req, res) {
    try {
      const rs = await qaService.getAll();
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async updateView(req, res) {
    try {
      const data = req.params.id;
      const rs = await qaService.updateView(data);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy bài đăng!!!");
      }
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async updateComment(req, res) {
    try {
      const data = req.params.id;
      const rs = await qaService.updateComment(data);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy bài đăng!!!");
      }
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async updateLike(req, res) {
    try {
      const data = req.body;
      const rs = await qaService.updateLike(data);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy bài đăng!!!");
      }
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // async updatePost(req, res) {
  //   try {
  //     const rs = await qaService.updatePost(req.body);
  //     if (!rs) {
  //       return res
  //         .status(404)
  //         .json("Không tìm thấy bài đăng!!!");
  //     }
  //     res.status(200).json(rs);
  //   } catch (error) {
  //     res.status(500).json(error.message);
  //   }
  // }
  async deletePost(req, res) {
    try {
      const rs = await qaService.delete(req.params.id);
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy câu hỏi!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      res.status(200).json({
        data: "Xóa câu hỏi thành công!!!",
        token,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  // async getPostByCategory(req, res) {
  //   try {
  //     const rs = await qaService.getPostByCategory(
  //       req.body
  //     );
  //     res.status(200).json(rs);
  //   } catch (error) {
  //     res.status(500).json(error.message);
  //   }
  // }
}
module.exports = new PostController();
