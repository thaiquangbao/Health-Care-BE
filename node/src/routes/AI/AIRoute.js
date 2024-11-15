const express = require("express");
const useRouter = express.Router();
const searchAIController = require("../../app/Controllers/SearchAIController");
useRouter.post("/search", searchAIController.searchAI);
module.exports = useRouter;
