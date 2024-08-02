const express = require("express");
const useRouter = express.Router();
const chatAIController = require("../../app/Controllers/ChatController/ChatAIController");
useRouter.post("/ask", chatAIController.chatAI);
module.exports = useRouter;
