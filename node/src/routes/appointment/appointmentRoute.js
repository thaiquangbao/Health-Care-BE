const express = require("express");
const useRouter = express.Router();
const appointmentController = require("../../app/Controllers/AppointmentController");
const customerController = require("../../app/Controllers/CustomerController");
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
useRouter.post(
  "/create-appointment-logbook",
  middleWareToken.validateToken,
  appointmentController.createAppointmentLogBook
);
useRouter.post("/save/customer", customerController.create);
useRouter.get("/get-one/:id", appointmentController.getOne);
useRouter.post(
  "/send-mail",
  appointmentController.sendMail
);
useRouter.post(
  "/findCountByDate",
  middleWareToken.validateToken,
  appointmentController.findCountByDate
);
useRouter.post(
  "/findByNextMonth",
  appointmentController.findByNextMonth
);
useRouter.post(
  "/findByMonth",
  appointmentController.findByMonth
);
useRouter.post(
  "/findByWeek",
  appointmentController.findByWeek
);
useRouter.post(
  "/complete",
  appointmentController.completeAppointment
);
useRouter.post(
  "/doctor-cancel",
  middleWareToken.validateToken,
  appointmentController.cancelAppointment
);
useRouter.post(
  "/patient-cancel",
  middleWareToken.validateToken,
  appointmentController.cancelPatientAppointment
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
  appointmentController.findByDate
);
useRouter.post(
  "/findByStatus",
  appointmentController.findByRecordAndStatus
);
useRouter.post(
  "/findByRecords",
  appointmentController.findByRecords
);
useRouter.get("/getAll", appointmentController.getAll);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  appointmentController.save
);
module.exports = useRouter;
