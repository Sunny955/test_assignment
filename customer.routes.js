const express = require("express");
const router = express.Router();
const {
  searchCustomer,
  getAllCities,
  getCustomer,
  addUser,
} = require("./customer.controller");

router.get("/", searchCustomer);
router.get("/:id", getCustomer);
router.get("/get/cities", getAllCities);
router.post("/", addUser);

module.exports = router;
