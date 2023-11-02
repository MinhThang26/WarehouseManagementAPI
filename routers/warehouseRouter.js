const router = require("express").Router();
const warehouseCategoryController = require("../controllers/warehouseCategoryController");
const middlewareController = require("../controllers/middlewareController");
const WarehouseController = require("../controllers/warehouseController");

router.get(
  "/category/list",middlewareController.verifyToken,warehouseCategoryController.getAllCategory
);

router.post("/create",middlewareController.verifyTokenIsOwner, 
WarehouseController.addWarehouse);

router.get("/list",middlewareController.verifyTokenIsOwner,
WarehouseController.getAllWarehouses);

router.get("/listWarehouseUser",middlewareController.verifyToken,
WarehouseController.getAllWarehouseUser);

router.put("/updateWarehouse/:id",middlewareController.verifyToken,WarehouseController.updateWarehouse);

router.delete("/deleteWarehouse/:id",middlewareController.verifyToken,WarehouseController.deleteWarehouse);

module.exports = router;
