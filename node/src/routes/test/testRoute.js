const express = require("express");
const useRouter = express.Router();
const testController = require("../../app/Controllers/TestController");
useRouter.post("/test-time", testController.testTime);
useRouter.post("/test-mail", testController.testMail);
module.exports = useRouter;