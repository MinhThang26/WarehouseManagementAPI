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
router.get(
    "/listChat",
    middlewareController.verifyToken,
    chatController.getListChat
);
router.get(
    "/getProfileUser/:id",
    chatController.getProfileUser
);
router.get(
    "/getProfileOwner/:id",
    chatController.getProfileOwner
);

module.exports = router;