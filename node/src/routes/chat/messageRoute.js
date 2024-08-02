const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const messageController = require("../../app/Controllers/ChatController/MessagesController");
useRouter.get(
  "/get-messages-rooms/:room_id",
  messageController.getMessagesByRooms
);
useRouter.post("/update", messageController.updateOne);
useRouter.post("/create", messageController.save);
module.exports = useRouter;
