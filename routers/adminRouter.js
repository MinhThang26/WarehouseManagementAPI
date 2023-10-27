const router = require("express").Router();
const adminController = require("../controllers/adminController");
const middlewareController = require("../controllers/middlewareController");

router.put(
  "/activate-owner",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccountOwner
);
router.put(
  "/activate-staff",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccountStaff
);
router.put(
  "/activate-staffs",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccountStaffs
);
router.put(
  "/activate-owners",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccountOwners
);
router.put(
  "/deactivate-owner",
  middlewareController.verifyTokenIsAdmin,
  adminController.deactivateAccountOwner
);
router.put(
  "/deactivate-staff",
  middlewareController.verifyTokenIsAdmin,
  adminController.deactivateAccountStaff
);
router.put(
  "/deactivate-staffs",
  middlewareController.verifyTokenIsAdmin,
  adminController.deactivateAccountStaffs
);
router.put(
  "/deactivate-owners",
  middlewareController.verifyTokenIsAdmin,
  adminController.deactivateAccountOwners
);

module.exports = router;
