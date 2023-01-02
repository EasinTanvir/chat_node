const express = require("express");
const router = express.Router();
const conController = require("../controllers/conversation");
const protectRoutes = require("../helper/protectRoutes");

router.route("/").get(protectRoutes, conController.fetchConversation);
router.route("/create").post(protectRoutes, conController.createConversation);

module.exports = router;
