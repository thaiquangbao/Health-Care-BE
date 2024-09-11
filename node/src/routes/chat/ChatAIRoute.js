const express = require("express");
const useRouter = express.Router();
const chatAIController = require("../../app/Controllers/ChatController/ChatAIController");
useRouter.post("/temperature-warning", chatAIController.temperatureWarning);
useRouter.post("/heartRate-warning", chatAIController.heartRateWarning);
useRouter.post("/bmi-warning", chatAIController.BMIWarning);
useRouter.post("/bloodPressure-warning", chatAIController.bloodPressureWarning);
useRouter.post("/ask", chatAIController.chatAI);
module.exports = useRouter;
