const express = require("express");
const useRouter = express.Router();
const adminController = require("../../app/Controllers/AdminController");
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
// logBooks
useRouter.get(
  "/get-logBooks-year",
  middleWareToken.validateToken,
  adminController.getLogBooksYear
);
useRouter.get(
  "/get-logBooks-month",
  middleWareToken.validateToken,
  adminController.getLogBooksMonth
);
useRouter.get(
  "/get-logBooks-week",
  middleWareToken.validateToken,
  adminController.getLogBooksWeek
);
useRouter.get(
  "/get-all-logBooks",
  middleWareToken.validateToken,
  adminController.getAllLogBooks
);
// appointmentHomes
useRouter.get(
  "/get-appointHome-year",
  middleWareToken.validateToken,
  adminController.getAppointHomeYear
);
useRouter.get(
  "/get-appointHome-month",
  middleWareToken.validateToken,
  adminController.getAppointHomeMonth
);
useRouter.get(
  "/get-appointHome-week",
  middleWareToken.validateToken,
  adminController.getAppointHomeWeek
);
useRouter.get(
  "/get-all-appointmentHomes",
  middleWareToken.validateToken,
  adminController.getAllAppointHome
);
// appointments
useRouter.get(
  "/get-appointments-month",
  middleWareToken.validateToken,
  adminController.getAppointmentsMonth
);
useRouter.get(
  "/get-appointments-year",
  middleWareToken.validateToken,
  adminController.getAppointmentsYear
);
useRouter.get(
  "/get-appointments-week",
  middleWareToken.validateToken,
  adminController.getAppointmentsWeek
);
useRouter.get(
  "/get-all-appointments",
  middleWareToken.validateToken,
  adminController.getAllAppointments
);
module.exports = useRouter;
