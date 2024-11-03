const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const payBackController = require("../../app/Controllers/PaybackController");
useRouter.post(
  "/refuse-status",
  middleWareToken.validateToken,
  payBackController.refuseStatus
);
useRouter.post(
  "/complete-status",
  middleWareToken.validateToken,
  payBackController.completeStatus
);
useRouter.post(
  "/accept-status",
  middleWareToken.validateToken,
  payBackController.acceptStatus
);
useRouter.post(
  "/request-status",
  middleWareToken.validateToken,
  payBackController.requestStatus
);
useRouter.post(
  "/get-by-type",
  middleWareToken.validateToken,
  payBackController.getByType
);
useRouter.post(
  "/get-by-status",
  middleWareToken.validateToken,
  payBackController.getByStatus
);
useRouter.post(
  "/get-by-service",
  middleWareToken.validateToken,
  payBackController.getByService
);
useRouter.post(
  "/get-by-doctor",
  middleWareToken.validateToken,
  payBackController.getByDoctor
);
useRouter.get(
  "/get-all",
  middleWareToken.validateToken,
  payBackController.getAll
);
useRouter.get(
  "/get-one/:id",
  middleWareToken.validateToken,
  payBackController.getOne
);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  payBackController.update
);
useRouter.post("/save", payBackController.save);
module.exports = useRouter;
