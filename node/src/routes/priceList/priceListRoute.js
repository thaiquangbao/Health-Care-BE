const express = require("express");
const useRouter = express.Router();
const middleWareToken = require("../../app/middlewares/MiddleWareToken");
const priceListController = require("../../app/Controllers/PriceListController");
useRouter.delete(
  "/delete/:id",
  middleWareToken.validateToken,
  priceListController.delete
);
useRouter.get(
  "/getById/:id",
  middleWareToken.validateToken,
  priceListController.getOne
);
useRouter.get("/getAll", priceListController.getAll);
useRouter.post(
  "/update",
  middleWareToken.validateToken,
  priceListController.update
);
useRouter.post(
  "/save",
  middleWareToken.validateToken,
  priceListController.create
);
module.exports = useRouter;
