const express = require("express");
const useRouter = express.Router();
const authController = require("../../app/Controllers/AuthenticateController");
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const patientController = require("../../app/Controllers/PatientController");
const doctorController = require("../../app/Controllers/DoctorController");
const upload = require("../../uploads/upload");
//doctor
useRouter.post(
  "/update-email/doctor",
  middleWareToken.validateToken,
  doctorController.updateEmailDoctor
);
useRouter.post(
  "/update-email/User",
  middleWareToken.validateToken,
  patientController.updateEmailPatient
);
useRouter.put(
  "/update-password/doctor/:id",
  middleWareToken.validateToken,
  doctorController.updatePassWordDoctor
);
useRouter.post(
  "/update-information/doctors",
  middleWareToken.validateToken,
  upload.single("image"),
  doctorController.updateDoctorImage
);
useRouter.post(
  "/delete/many-doctor",
  middleWareToken.validateToken,
  doctorController.deleteManyDoctor
);
useRouter.delete(
  "/delete/one-doctor/:id",
  middleWareToken.validateToken,
  doctorController.deleteDoctor
);
useRouter.post(
  "/get-one/doctor",
  middleWareToken.validateToken,
  doctorController.getOneDoctor
);
useRouter.get(
  "/all/doctor",
  middleWareToken.validateToken,
  doctorController.getAllDoctor
);
useRouter.post(
  "/update/doctor",
  middleWareToken.validateToken,
  doctorController.updateDoctor
);
useRouter.post(
  "/create-doctor",
  middleWareToken.validateToken,
  doctorController.createDoctor
);
// patient

useRouter.put(
  "/update-password/patient/:id",
  middleWareToken.validateToken,
  patientController.updatePassWordPatient
);
useRouter.post(
  "/update-information/patients",
  middleWareToken.validateToken,
  upload.single("image"),
  patientController.updatePatientImage
);
useRouter.post(
  "/delete/many-patient",
  middleWareToken.validateToken,
  patientController.deleteManyPatient
);
useRouter.delete(
  "/delete/one-patient/:id",
  middleWareToken.validateToken,
  patientController.deletePatient
);
useRouter.post(
  "/get-one/patient",
  middleWareToken.validateToken,
  patientController.getOnePatient
);
useRouter.get(
  "/all/patient",
  middleWareToken.validateToken,
  patientController.getAllPatient
);
useRouter.post(
  "/update/User",
  middleWareToken.validateToken,
  patientController.updatePatient
);
//users
useRouter.get(
  "/all",
  middleWareToken.validateToken,
  authController.geAllUser
);
// token
useRouter.get(
  "/userByToken",
  middleWareToken.validateToken,
  authController.getUserByToken
);
// không càn token
useRouter.post(
  "/take-password/patient",
  patientController.takePasswordPatient
);
useRouter.post(
  "/take-password/doctor",
  doctorController.takePasswordDoctor
);
useRouter.post(
  "/check-auth",
  authController.checkExistAuth
);
useRouter.post("/login/admin", authController.loginAdmin);
useRouter.post("/login", authController.loginAuth);
useRouter.post(
  "/update",
  authController.updateProcessSignup
);
useRouter.post(
  "/generateToken",
  authController.generateToken
);
useRouter.post("/signup", authController.signup);
module.exports = useRouter;
