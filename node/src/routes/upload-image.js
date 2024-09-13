const express = require("express");
const useRouter = express.Router();
const imageController = require("../app/Controllers/ImageController");
const upload = require("../uploads/upload");
useRouter.post(
  "/save",
  upload.array("files"),
  imageController.postImage
);
useRouter.post(
  "/mobile/upload",
  imageController.postImageMobile
);
module.exports = useRouter;
