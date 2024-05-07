const express = require("express");
const router = express.Router();
const commentController = require("../Controllers/comment.controller");
const authMiddleware = require("../Middlewares/auth.middleware");

router.route("/create/comment/post/:id").post(authMiddleware, commentController.createComment)
router.route("/delete/comment/:id").delete(authMiddleware, commentController.deleteComment)
router.route("/update/comment/:id").put(authMiddleware, commentController.updateComment)
router.route("/get/comment/:id").get(authMiddleware, commentController.getCommentById)
router.route("/get/comments/post/:id").get(authMiddleware, commentController.getCommentByPostId)

module.exports = router