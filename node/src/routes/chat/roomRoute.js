const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const roomController = require("../../app/Controllers/ChatController/RoomsController");
useRouter.get("/all", roomController.getAll);
useRouter.get(
  "/get-room-patient/:id",
  middleWareToken.validateToken,
  roomController.getRoomByPatient
);
useRouter.get(
  "/get-room-doctor/:id",
  middleWareToken.validateToken,
  roomController.getRoomByDoctor
);
useRouter.post(
  "/get-patient-doctor",
  middleWareToken.validateToken,
  roomController.getRoomByDoctorAndPatient
);
useRouter.post("/update",middleWareToken.validateToken, roomController.updateOne);
useRouter.post("/create", roomController.save);
module.exports = useRouter;
