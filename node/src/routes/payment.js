const express = require("express");
const useRouter = express.Router();
const paymentController = require("../app/Controllers/PaymentController");
const middleware = require("../app/middlewares/MiddleWareToken");
useRouter.post("/pay-for-patient", 
  middleware.validateToken, 
  paymentController.paymentForPatient
);
useRouter.post("/pay-for-doctor", 
  middleware.validateToken, 
  paymentController.paymentForDoctor
);
useRouter.post("/find-by-category", 
  middleware.validateToken, 
  paymentController.findByCategory
);
useRouter.post("/find-by-patient", 
  middleware.validateToken, 
  paymentController.findByPatient
);
useRouter.post("/find-by-doctor", 
  middleware.validateToken, 
  paymentController.findByDoctor
);
useRouter.post("/find-by-date", 
  middleware.validateToken, 
  paymentController.findByDate
);
useRouter.post("/find-by-status-doctor", 
  middleware.validateToken, 
  paymentController.findByStatusDoctor
);
useRouter.post("/find-by-status", 
  middleware.validateToken, 
  paymentController.findByStatus
);
useRouter.get(
  "/get-all",
  middleware.validateToken,
  paymentController.getAll
);
useRouter.get(
  "/get-one/:id",
  middleware.validateToken,
  paymentController.getOne
);
useRouter.post(
  "/update", 
  middleware.validateToken, 
  paymentController.update
);
useRouter.post(
  "/save",
  paymentController.save
);
useRouter.post(
  "/create_payment_url",
  paymentController.payment
);
module.exports = useRouter;