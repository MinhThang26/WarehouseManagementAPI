const router = require("express").Router();
const uploadCloud = require("../config/cloudinaryConfig");
const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", middlewareController.verifyToken, authController.logout);
router.put(
  "/update-account",
  middlewareController.verifyToken,
  uploadCloud.single("image"),
  authController.updateAccount
);
router.put(
  "/change-password",
  middlewareController.verifyToken,
  authController.changePassword
);
router.get(
  "/account-by-id",
  middlewareController.verifyToken,
  authController.getAccountById
);

module.exports = router;
