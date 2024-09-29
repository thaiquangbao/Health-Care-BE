const express = require("express");
const useRouter = express.Router();
const paymentController = require("../app/Controllers/PaymentController");
useRouter.post(
  "/create_payment_url",
  (req, res, next) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    paymentController.payment(req, res);
});
module.exports = useRouter;