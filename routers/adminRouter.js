const router = require("express").Router();
const adminController = require("../controllers/adminController");
const middlewareController = require("../controllers/middlewareController");

router.put(
  "/activate-account",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccount
);
router.put(
  "/deactivate-account",
  middlewareController.verifyTokenIsAdmin,
  adminController.deactivateAccount
);
router.put(
  "/activate-multiple-accounts",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateMultipleAccounts
);
router.put(
  "/deactivate-multiple-accounts",
  middlewareController.verifyTokenIsAdmin,
  adminController.deactivateMultipleAccounts
);
router.get(
  "/list-account-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllAccountByIsActivate
);
router.get(
  "/list-account-not-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllAccountByNotActivate
);
router.get(
  "/list-owner-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllOwnerByIsActivate
);
router.get(
  "/list-owner-not-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllOwnerByNotActivate
);
router.get(
  "/list-user-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllUserByIsActivate
);
router.get(
  "/list-user-not-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllUserByNotActivate
);

module.exports = router;
