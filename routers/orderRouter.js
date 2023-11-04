const router = require("express").Router();
const OrderController  = require("../controllers/orderController");

router.post('/create',OrderController.addOrder);
router.delete("/deleteOrder/:id",OrderController.deleteOrder);

router.get("/list",OrderController.getAnOrder);

module.exports = router;
