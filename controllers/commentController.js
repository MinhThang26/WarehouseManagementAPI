const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const { checkAccountById } = require("./adminController");

const commentController = {
  createComment: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idAccount = req.user.id;
      const idBlog = req.query.idBlog;
      const content = req.body.content;
      const account = await checkAccountById(idAccount);
      if (!idBlog) {
        status = 404;
        data = {
          success: false,
          message: "Create comment failed due to lack idBlog",
        };
      } else {
        const blog = await Blog.findById(idBlog);
        if (!blog) {
          status = 404;
          data = {
            success: false,
            message: "Create comment failed, blog not found",
          };
        } else {
          if (!content) {
            status = 400;
            data = {
              success: false,
              message: "Create comment failed due to lack content",
            };
          } else {
            const comment = new Comment({
              account: idAccount,
              blog: idBlog,
              content: content,
            });
            const savedComment = await comment.save();
            await account.updateOne({
              $push: {
                comments: savedComment._id,
              },
            });
            await blog.updateOne({
              $push: {
                comments: savedComment._id,
              },
            });
            status = 200;
            data = {
              success: true,
              message: "Create comment successfully",
              data: savedComment,
            };
          }
        }
      }
    } catch (error) {
      data = error;
    }
    res.status(status).json(data);
  },
};
module.exports = commentController;
