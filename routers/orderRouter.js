const router = require("express").Router();
const makeMiddleware = require("multer/lib/make-middleware");
const OrderController  = require("../controllers/orderController");
const middlewareController = require("../controllers/middlewareController");

router.post('/create',OrderController.addOrder);

router.delete("/deleteOrder/:id",OrderController.deleteOrder);

router.get("/list",OrderController.getAnOrder);

router.get("/getAOrder",middlewareController.verifyToken,OrderController.getAOrder);

module.exports = router;
