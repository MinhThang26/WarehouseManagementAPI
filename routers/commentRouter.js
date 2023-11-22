const router = require("express").Router();
const middlewareController = require("../controllers/middlewareController");
const commentController = require("../controllers/commentController");

router.post(
  "/create",
  middlewareController.verifyToken,
  commentController.createComment
);
router.get(
  "/list-by-blog",
  middlewareController.verifyToken,
  commentController.getListComment
);

module.exports = router;
