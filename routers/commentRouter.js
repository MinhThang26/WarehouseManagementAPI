const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const commentController = require("../controllers/commentController");

router.post(
  "/create",
  middlewareController.verifyToken,
  commentController.createComment
);

module.exports = router;
