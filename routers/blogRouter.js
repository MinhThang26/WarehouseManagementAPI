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

module.exports = router;
