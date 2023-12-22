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
  blogController.getListBlogByAll
);
router.put(
  "/update",
  middlewareController.verifyTokenIsOwner,
  blogController.updateBlog
);
router.put(
  "/likes/:bid",
  blogController.likeBlog
);
router.put(
  "/dislikes/:bid",
  blogController.disLikeBlog
);

module.exports = router;
