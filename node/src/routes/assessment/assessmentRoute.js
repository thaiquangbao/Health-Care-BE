const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const assessmentController = require("../../app/Controllers/AssessmentController");
useRouter.get("/getOne/:id", assessmentController.getOne);
useRouter.get(
  "/getByDoctorRecord/:id",
  assessmentController.getByDoctorRecordId
);
useRouter.get("/getAll", assessmentController.getAll);
useRouter.post("/save", assessmentController.create);
module.exports = useRouter;
