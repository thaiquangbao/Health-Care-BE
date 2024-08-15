const postModel = require("../../models/blogs/postModels");
class PostService {
  async createPost(data) {
    const newPost = new postModel(data);
    return await newPost.save();
  }
  async getPostById(id) {
    const rs = await postModel.findById(id);
    if (!rs) {
      return 0;
    }
    return rs;
  }
  async getPosts() {
    return await postModel.find();
  }
  async updatePost(data) {
    const post = await postModel.findById(data._id);
    if (!post) {
      return 0;
    }
    return await postModel.findByIdAndUpdate(
      post._id,
      data,
      {
        new: true,
      }
    );
  }
  async deletePost(id) {
    const post = await postModel.findById(id);
    if (!post) {
      return 0;
    }
    return await postModel.findByIdAndDelete(id);
  }
  async getPostByCategory(data) {
    return await postModel.find({
      category: data.category,
    });
  }
}
module.exports = new PostService();
