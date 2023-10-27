const router = require("express").Router();
const warehouseCategoryController = require("../controllers/warehouseCategoryController");
const middlewareController = require("../controllers/middlewareController");
const WarehouseController = require("../controllers/warehouseController");

router.get(
  "/category/list",
  middlewareController.verifyToken,
  warehouseCategoryController.getAllCategory
);

router.post("/addWarehouse",WarehouseController.addWarehouse);

router.get("/",WarehouseController.getAllWarehouses);

router.put("/updateWarehouse/:id",WarehouseController.updateWarehouse);

router.delete("/deleteWarehouse/:id",WarehouseController.deleteWarehouse);

module.exports = router;
