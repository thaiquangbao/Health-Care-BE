const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const forumController = require("../../app/Controllers/Blogs/ForumController");
useRouter.post(
  "/update/views/:id",
  forumController.addViews
);
useRouter.delete(
  "/delete-one/:id",
  middleWareToken.validateToken,
  forumController.delete
);
useRouter.get("/get-one/:id", forumController.getOne);
useRouter.post(
  "/get-by-category",
  forumController.getByCategory
);
useRouter.get(
  "/get-by-doctor/:id",
  forumController.getByDoctor
);
useRouter.post("/update/likes", forumController.addLikes);
useRouter.get("/get-all", forumController.getAll);
useRouter.post("/update", forumController.update);
useRouter.post("/save", forumController.create);
module.exports = useRouter;
