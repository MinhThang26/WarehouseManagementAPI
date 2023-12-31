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
  commentController.getListComment
);
router.delete(
  "/delete",
  middlewareController.verifyToken,
  commentController.deleteComment
);
router.put(
  "/update",
  middlewareController.verifyToken,
  commentController.updateComment
);

module.exports = router;
