const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller");
const authMiddlware = require("../Middlewares/auth.middleware");
const upload = require("../Middlewares/multer.middleware");

router.route("/signup").post(authController.signup)
router.route("/login").post(authController.login)
router.route("/user").get(authMiddlware, authController.userInfo)
router.route("/user/:id").get(authController.getUserById)
router.route("/user/update/:id").patch(authMiddlware,  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), authController.updateUser)


module.exports = router