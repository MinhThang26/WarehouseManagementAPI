const router = require("express").Router();
const warehouseCategoryController = require("../controllers/warehouseCategoryController");
const middlewareController = require("../controllers/middlewareController");

router.get(
  "/category/list",
  middlewareController.verifyToken,
  warehouseCategoryController.getAllCategory
);

module.exports = router;
