const express = require("express");
const router = express.Router();
const postController = require("../Controllers/post.controller");
const authMiddleware = require("../Middlewares/auth.middleware");
const upload = require("../Middlewares/multer.middleware");

router.route("/all/posts").get(postController.getAllPosts)
router.route("/post/:id").get(postController.getPostById)
router.route("/create/post").post(authMiddleware, upload.single("file"), postController.createPost)
router.route("/post/user/:id").get(postController.getPostByUser)
router.route("/update/post/:id").put(authMiddleware, postController.updatePost)
router.route("/delete/post/:id").delete(postController.deletePost)
router.route("/like/post/:id").put(authMiddleware, postController.likePost)
router.route("/follow/user/:id").put(authMiddleware, postController.followUser)

module.exports = router
