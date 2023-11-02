const router = require("express").Router();
const uploadCloud = require("../config/cloudinaryConfig");
const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", middlewareController.verifyToken, authController.logout);
router.post(
  "/update-account",
  uploadCloud.single("image"),
  authController.updateAccount
);

module.exports = router;
