const router = require("express").Router();
const OrderController  = require("../controllers/orderController");
const middlewareController = require("../controllers/middlewareController");

router.post('/create',OrderController.addOrder);
router.delete("/deleteOrder/:id",middlewareController.verifyTokenIsOwner, OrderController.deleteOrder);

router.get("/list",OrderController.getAnOrder);

module.exports = router;
