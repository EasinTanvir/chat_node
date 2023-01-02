const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const protectRoutes = require("../helper/protectRoutes");

router.route("/").get(protectRoutes, userController.fetchUsers);
router.route("/create").post(userController.createUser);
router.route("/login").post(userController.signIn);

module.exports = router;
