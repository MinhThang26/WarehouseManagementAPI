const router = require("express").Router();
const adminController = require("../controllers/adminController");
const middlewareController = require("../controllers/middlewareController");

router.put(
  "/update-owner",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccountOwner
);
router.put(
  "/update-staff",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccountStaff
);

module.exports = router;
