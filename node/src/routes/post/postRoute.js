const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const postController = require("../../app/Controllers/Blogs/PostController");
useRouter.get(
  "/get-category",
  postController.getPostByCategory
);
useRouter.delete(
  "/delete/:id",
  middleWareToken.validateToken,
  postController.deletePost
);
useRouter.get("/getById/:id", postController.getPostById);
useRouter.get("/getAll", postController.getPosts);
useRouter.post("/update", postController.updatePost);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  postController.createPost
);
module.exports = useRouter;
