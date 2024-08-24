const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const noticeController = require("../../app/Controllers/NoticeController");
useRouter.get(
  "/get-by-user/:id",
  noticeController.getByUser
);
useRouter.get("/get-one/:id", noticeController.getById);
useRouter.get("/get-all", noticeController.getAll);
useRouter.post("/update", noticeController.update);
useRouter.post("/save", noticeController.create);
module.exports = useRouter;
