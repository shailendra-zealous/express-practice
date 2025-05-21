const express = require('express');
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const postController = require("../controller/post_controller");

router.use(verifyToken)

router.post("/create-post", postController.createPost);

module.exports = router;