const express = require("express");
const useRouter = express.Router();
const paymentController = require("../app/Controllers/PaymentController");
useRouter.post(
  "/",
  paymentController.payment
);
module.exports = useRouter;