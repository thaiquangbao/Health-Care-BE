const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const healthLogBookController = require("../../app/Controllers/HealthLogBookController");
useRouter.get(
    "/findByPatient/:id",
    middleWareToken.validateToken,
    healthLogBookController.findByPatient
);
useRouter.get(
    "/findByDoctor/:id",
    middleWareToken.validateToken,
    healthLogBookController.findByDoctor
);
useRouter.get(
    "/get-one/:id",
    middleWareToken.validateToken,
    healthLogBookController.getOne
);
useRouter.post(
    "/update-doctor",
    middleWareToken.validateToken,
    healthLogBookController.updateDoctor
);
useRouter.post(
    "/stopped",
    middleWareToken.validateToken,
    healthLogBookController.stopped
);
useRouter.post(
    "/rejected",
    middleWareToken.validateToken,
    healthLogBookController.rejected
);
useRouter.post(
    "/accepted",
    middleWareToken.validateToken,
    healthLogBookController.accepted
);
useRouter.get(
    "/get-all",
    middleWareToken.validateToken,
    healthLogBookController.getAll
);
useRouter.post(
    "/update", 
    middleWareToken.validateToken,
    healthLogBookController.update
)
useRouter.post("/save", 
    middleWareToken.validateToken,
    healthLogBookController.save
);
module.exports = useRouter;