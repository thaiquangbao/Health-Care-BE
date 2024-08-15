const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const sickController = require("../../app/Controllers/SickController");
const upload = require("../../uploads/upload");

useRouter.get("/get-one/:id", sickController.getOne);
useRouter.delete(
  "/deleteOne/:id",
  middleWareToken.validateToken,
  sickController.delete
);
useRouter.post(
  "/deleteAll",
  middleWareToken.validateToken,
  sickController.deleteAll
);
useRouter.get("/get-all", sickController.findAll);
useRouter.post(
  "/update-image",
  middleWareToken.validateToken,
  upload.single("image"),
  sickController.updateImage
);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  sickController.update
);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  sickController.save
);
module.exports = useRouter;
