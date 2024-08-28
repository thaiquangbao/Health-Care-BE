const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const messageController = require("../../app/Controllers/ChatController/MessagesController");
useRouter.get(
  "/get-messages-rooms/:room_id",
  messageController.getMessagesByRooms
);
useRouter.post("/update",middleWareToken.validateToken, messageController.updateOne);
useRouter.post("/create",middleWareToken.validateToken, messageController.save);
module.exports = useRouter;
