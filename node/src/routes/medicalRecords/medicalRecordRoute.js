const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const medicalRecordController = require("../../app/Controllers/MedicalRecordController");
const mailerController = require("../../app/Controllers/MailerController");
useRouter.post("/send-mail/:id", mailerController.mailMedicalRecord);
useRouter.get(
  "/get-appointment/:id",
  medicalRecordController.findByAppointment
);
useRouter.get(
  "/findByDoctor/:id",
  medicalRecordController.findByDoctor
);
useRouter.get(
  "/findByPatient/:id",
  medicalRecordController.findByPatient
);
useRouter.get(
  "/findById/:id",
  medicalRecordController.getOne
);
useRouter.delete(
  "/delete/:id",
  medicalRecordController.delete
);
useRouter.post(
  "/check-medical",
  medicalRecordController.checkMedicalRecord
);
useRouter.post(
  "/check-appointment",
  medicalRecordController.checkAppointment
);
useRouter.get("/getAll", medicalRecordController.getAll);
useRouter.post(
  "/delete-many",
  medicalRecordController.delete
);
useRouter.post("/update", medicalRecordController.update);
useRouter.post("/save", medicalRecordController.save);
module.exports = useRouter;
