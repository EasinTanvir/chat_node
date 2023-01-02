const express = require("express");
const router = express.Router();
const msgController = require("../controllers/message");
const protectRoutes = require("../helper/protectRoutes");

router.route("/:id").get(protectRoutes, msgController.fetchMessage);
router.route("/create").post(protectRoutes, msgController.createMessage);

module.exports = router;
