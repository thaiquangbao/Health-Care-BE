const express = require("express");
const useRouter = express.Router();

const customerController = require("../../app/Controllers/CustomerController");
useRouter.post("/save", customerController.createCustomer);
module.exports = useRouter;
