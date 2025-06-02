const express = require('express');
const router = express.Router();

const upload = require('multer')();
const userController = require("../controller/user_controller")

const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/user", userController.getUser)

router.post("/edit-profile", upload.any(), userController.editProfile)

module.exports = router;