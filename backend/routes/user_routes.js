const express = require('express');
const router = express.Router();

const userController = require("../controller/user_controller")

const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/user", userController.getUser)

router.post("/edit-profile", userController.editProfile)

module.exports = router;