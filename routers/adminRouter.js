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
  adminController.getAllAccountByIsActive
);
router.get(
  "/list-account-not-active",
  middlewareController.verifyTokenIsAdmin,
  adminController.getAllAccountByIsNotActive
);
router.put(
  "/activate-account",
  middlewareController.verifyTokenIsAdmin,
  adminController.activateAccount
);

module.exports = router;
