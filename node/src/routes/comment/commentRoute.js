const express = require("express");
const useRouter = express.Router();
const commentController = require("../../app/Controllers/Blogs/CommentController");
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
useRouter.get("/get-one/:id", commentController.getOne);
useRouter.get("/get-by-qa/:id", commentController.getByQA);
useRouter.get("/get-all", commentController.getAll);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  commentController.save
);
module.exports = useRouter;
