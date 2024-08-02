const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const roomController = require("../../app/Controllers/ChatController/RoomsController");
useRouter.get("/all", roomController.getAll);
useRouter.get(
  "/get-room-user/:user_id",
  roomController.getRoomByUser
);
useRouter.post("/update", roomController.updateOne);
useRouter.post("/create", roomController.save);
module.exports = useRouter;
