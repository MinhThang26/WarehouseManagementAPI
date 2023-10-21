const router = require("express").Router();
const authController = require("../controllers/authController");
const middlewareController = require("../controllers/middlewareController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", middlewareController.verifyToken, authController.logout);
router.get("/", (req, res) => {
  console.log("hello");
  res.status(200).json("hello");
});
module.exports = router;
