const express = require('express');
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const postController = require("../controller/post_controller");

router.use(verifyToken)

router.param("post", postController.bindPost);

router.post("/create-post", postController.createPost);

router.get("/posts", postController.postListing);
router.get("/post/:post", postController.viewPost);

module.exports = router;