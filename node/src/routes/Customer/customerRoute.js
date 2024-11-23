const express = require("express");
const useRouter = express.Router();
const customerController = require("../../app/Controllers/CustomerController");
const authenticateController = require("../../app/Controllers/AuthenticateController");
useRouter.delete("/delete-one/:id", customerController.deleteCustomer);
useRouter.get("/get-all", customerController.getAllCustomer);
useRouter.post(
  "/generate-token-zego",
  authenticateController.generateTokenZego
);
useRouter.post("/save", customerController.createCustomer);
module.exports = useRouter;
