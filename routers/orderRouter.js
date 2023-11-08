const router = require("express").Router();
const OrderController  = require("../controllers/orderController");
const middlewareController = require("../controllers/middlewareController");

router.post('/create',middlewareController.verifyToken,OrderController.addOrder);

router.delete("/deleteOrderByUser",middlewareController.verifyToken,OrderController.deleteOrderByUser);

router.delete("/deleteOrderByOwner",middlewareController.verifyTokenIsOwner,OrderController.deleteOrderByOwner);

//router.get("/list",OrderController.getAnOrder);

router.get("/getAOrder",middlewareController.verifyToken,OrderController.getAOrder);

module.exports = router;
