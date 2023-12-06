const router = require("express").Router();
const chatController = require("../controllers/chatController");
const middlewareController = require("../controllers/middlewareController");

router.post(
    "/createChat",
    middlewareController.verifyToken,
    chatController.createChat
);
router.get(
    "/findUser/:userId",
    middlewareController.verifyToken,
    chatController.userChats
);
router.get(
    "/find/:firstId/:secondId",
    middlewareController.verifyToken,
    chatController.findChat
);

module.exports = router;