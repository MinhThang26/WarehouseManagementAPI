const router = require("express").Router();
const warehouseCategoryController = require("../controllers/warehouseCategoryController");
const middlewareController = require("../controllers/middlewareController");
const WarehouseController = require("../controllers/warehouseController");

router.get(
  "/category/list",warehouseCategoryController.getAllCategory
);

router.post("/create",middlewareController.verifyTokenIsOwner, 
WarehouseController.addWarehouse);

router.get("/list",
WarehouseController.getAWarehouses);

router.get("/listWarehouseUser",
WarehouseController.getAllWarehouseUser);

router.put("/updateWarehouse/:id",middlewareController.verifyToken,WarehouseController.updateWarehouse);

router.delete("/deleteWarehouse/:id",middlewareController.verifyTokenIsOwner,WarehouseController.deleteWarehouse);

router.get("/search",WarehouseController.searchWarehouse);

router.get("/getAWarehouse",WarehouseController.getAWarehouse);

module.exports = router;
