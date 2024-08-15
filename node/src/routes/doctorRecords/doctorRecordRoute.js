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
  doctorRecordController.updateDoctorRecord
);
useRouter.get(
  "/get-one/:id",
  doctorRecordController.getOne
);
useRouter.get(
  "/getById/:id",
  doctorRecordController.getById
);
// useRouter.get("/", doctorRecordController.index);
module.exports = useRouter;
