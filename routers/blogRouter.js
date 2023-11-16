const router = require("express").Router();
const blogController = require("../controllers/blogController");
const middlewareController = require("../controllers/middlewareController");
router.post(
  "/create",
  middlewareController.verifyTokenIsOwner,
  blogController.createBlog
);
router.get(
  "/get-by-id",
  middlewareController.verifyToken,
  blogController.getBlogById
);
router.get(
  "/list-by-owner",
  middlewareController.verifyToken,
  blogController.getListBlogByOwner
);
router.put(
  "/update",
  middlewareController.verifyTokenIsOwner,
  blogController.updateBlog
);

module.exports = router;
