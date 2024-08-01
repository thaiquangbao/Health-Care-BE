const express = require("express");
const useRouter = express.Router();
const appointmentController = require("../../app/Controllers/AppointmentController");
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
useRouter.post(
  "/send-mail",
  appointmentController.sendMail
);
useRouter.post(
  "/doctor-reject",
  middleWareToken.validateToken,
  appointmentController.denyAppointment
);
useRouter.post(
  "/doctor-accept",
  middleWareToken.validateToken,
  appointmentController.acceptAppointment
);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  appointmentController.updateAppointment
);
useRouter.post(
  "/findByDate",
  middleWareToken.validateToken,
  appointmentController.findByDate
);
useRouter.post(
  "/findByStatus",
  middleWareToken.validateToken,
  appointmentController.findByRecordAndStatus
);
useRouter.post(
  "/findByRecords",
  middleWareToken.validateToken,
  appointmentController.findByRecords
);
useRouter.get("/getAll", appointmentController.getAll);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  appointmentController.save
);
module.exports = useRouter;
