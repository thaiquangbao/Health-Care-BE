const express = require("express");
const useRouter = express.Router();
const appointmentHomeController = require("../../app/Controllers/AppointmentHomeController");
const customerController = require("../../app/Controllers/CustomerController");
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
// useRouter.post(
//   "/create-appointment-logbook",
//   middleWareToken.validateToken,
//   appointmentController.createAppointmentLogBook
// );
// useRouter.post("/save/customer", customerController.create);
// useRouter.get("/get-one/:id", appointmentController.getOne);
// useRouter.post(
//   "/send-mail",
//   appointmentController.sendMail
// );

useRouter.post(
  "/patient-cancel",
  middleWareToken.validateToken,
  appointmentHomeController.patientCancelAppointmentHome
);
useRouter.post(
  "/complete",
  appointmentHomeController.completeAppointmentHome
);

useRouter.post(
  "/payment",
  middleWareToken.validateToken,
  appointmentHomeController.paymentAppointmentHome
);
useRouter.post(
  "/findByStatus",
  appointmentHomeController.findByRecordAndStatus
);
useRouter.post(
  "/doctor-cancel",
  middleWareToken.validateToken,
  appointmentHomeController.cancelAppointmentHome
);
useRouter.post(
  "/doctor-reject",
  middleWareToken.validateToken,
  appointmentHomeController.denyAppointmentHome
);
useRouter.post(
  "/doctor-accept",
  middleWareToken.validateToken,
  appointmentHomeController.acceptAppointmentHome
);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  appointmentHomeController.updateAppointmentHome
);
useRouter.post(
  "/findByNextMonth",
  appointmentHomeController.findByNextMonth
);
useRouter.post(
  "/findByMonth",
  appointmentHomeController.findByMonth
);
useRouter.post(
  "/findByWeek",
  appointmentHomeController.findByWeek
);
useRouter.post(
  "/findByDate",
  appointmentHomeController.findByDate
);
useRouter.get(
  "/findByPatient/:id",
  middleWareToken.validateToken,
  appointmentHomeController.findByPatient
);
useRouter.get(
  "/findByRecord/:id",
  middleWareToken.validateToken,
  appointmentHomeController.findByDoctorRecord
);
useRouter.get("/getAll", middleWareToken.validateToken,appointmentHomeController.getAll);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  appointmentHomeController.save
);
module.exports = useRouter;
