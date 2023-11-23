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
router.delete(
  "/delete-blog/:id",
  middlewareController.verifyTokenIsOwner,
  blogController.deleteBlog
);
router.get(
  "/list-by-blog",
  middlewareController.verifyToken,
  blogController.getListBlogByAll
);
router.put(
  "/update",
  middlewareController.verifyTokenIsOwner,
  blogController.updateBlog
);
router.put(
  "/likes/:bid",
  middlewareController.verifyToken,
  blogController.likeBlog
);
router.put(
  "/dislikes/:bid",
  middlewareController.verifyToken,
  blogController.disLikeBlog
);

module.exports = router;
