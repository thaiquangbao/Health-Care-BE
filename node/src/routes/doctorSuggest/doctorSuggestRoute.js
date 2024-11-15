const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const doctorSuggestController = require("../../app/Controllers/DoctorSuggestController");

useRouter.get(
  "/get-one/doctor-record/:id",
  doctorSuggestController.findById
);
useRouter.delete(
  "/delete/:id",
  middleWareToken.validateToken,
  doctorSuggestController.remove
);
useRouter.get("/get-all", doctorSuggestController.findAll);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  doctorSuggestController.update
);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  doctorSuggestController.save
);
module.exports = useRouter;
