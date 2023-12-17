const router = require("express").Router();
const OrderController = require("../controllers/orderController");
const middlewareController = require("../controllers/middlewareController");

router.post(
  "/create",
  middlewareController.verifyToken,
  OrderController.addOrder
);
router.delete(
  "/deleteOrderByUser",
  middlewareController.verifyToken,
  OrderController.deleteOrderByUser
);

router.delete(
  "/deleteOrderByOwner",
  middlewareController.verifyTokenIsOwner,
  OrderController.deleteOrderByOwner
);

router.get(
  "/listOrderByOwner",
  middlewareController.verifyTokenIsOwner,
  OrderController.getOrderForOwner
);

router.get(
  "/listOrderByUser",
  middlewareController.verifyToken,
  OrderController.getOrderForUser
);

router.get(
  "/getAOrder",
  middlewareController.verifyToken,
  OrderController.getAOrder
);

router.get(
  "/searchOrder",
  middlewareController.verifyToken,
  OrderController.searchOrder
);

router.put(
  "/activate",
  middlewareController.verifyTokenIsOwner,
  OrderController.activateOrder
);

router.put(
  "/payment",
  middlewareController.verifyTokenIsOwner,
  OrderController.paymentOrder
);

module.exports = router;
