const router = require("express").Router();
const messageController = require("../controllers/messageController");
const middlewareController = require("../controllers/middlewareController");

router.post(
    "/createMessage",
    middlewareController.verifyToken,
    messageController.createMessage
);

router.get(
    "/findMessage/:chatId",
    middlewareController.verifyToken,
    messageController.getMessage
);

module.exports = router;