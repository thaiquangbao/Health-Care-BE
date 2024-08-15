const postService = require("../../Services/BlogsService/PostService");
class PostController {
  async createPost(req, res) {
    try {
      const rs = await postService.createPost(req.body);
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      return res.status(200).json({ data: rs, token });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getPostById(req, res) {
    try {
      const rs = await postService.getPostById(
        req.params.id
      );
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
  async getPosts(req, res) {
    try {
      const rs = await postService.getPosts();
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async updatePost(req, res) {
    try {
      const rs = await postService.updatePost(req.body);
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
  async deletePost(req, res) {
    try {
      const rs = await postService.deletePost(
        req.params.id
      );
      if (!rs) {
        return res
          .status(404)
          .json("Không tìm thấy bài đăng!!!");
      }
      const accessToken = req.headers["accesstoken"];
      const refreshToken = req.headers["refreshtoken"];
      const token = { accessToken, refreshToken };
      res.status(200).json({
        data: "Xóa bài đăng thành công!!!",
        token,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
  async getPostByCategory(req, res) {
    try {
      const rs = await postService.getPostByCategory(
        req.body
      );
      res.status(200).json(rs);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
}
module.exports = new PostController();
