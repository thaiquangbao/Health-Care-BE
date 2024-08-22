const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const qaController = require("../../app/Controllers/Blogs/QAController");
const upload = require("../../uploads/upload");
// useRouter.get(
//   "/get-category",
//   postController.getPostByCategory
// );
// useRouter.delete(
//   "/delete/:id",
//   middleWareToken.validateToken,
//   postController.deletePost
// );
useRouter.get("/get-one/:id", qaController.getOne);
useRouter.get("/get-all", qaController.getAll);
useRouter.post(
  "/update-comment/:id",
  qaController.updateComment
);
useRouter.post("/update-view/:id", qaController.updateView);
useRouter.post("/update-like", qaController.updateLike);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  qaController.createQA
);
module.exports = useRouter;
