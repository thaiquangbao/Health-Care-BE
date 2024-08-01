const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const doctorRecordController = require("../../app/Controllers/DoctorRecordController");
useRouter.post(
  "/deleteMany",
  middleWareToken.validateToken,
  doctorRecordController.deleteAllDoctorRecord
);
useRouter.delete(
  "/deleteOne/:id",
  middleWareToken.validateToken,
  doctorRecordController.deleteOneDoctorRecord
);
useRouter.get(
  "/getAll",
  doctorRecordController.getAllDoctorRecord
);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  doctorRecordController.updateDoctorRecord
);
useRouter.get(
  "/getById/:id",
  middleWareToken.validateToken,
  doctorRecordController.getById
);
// useRouter.get("/", doctorRecordController.index);
module.exports = useRouter;
