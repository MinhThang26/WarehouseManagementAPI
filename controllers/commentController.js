const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const adminController = require("./adminController");
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
  getListComment: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idBlog = req.query.idBlog;
      if (!idBlog) {
        status = 404;
        data = {
          success: false,
          message: "Read comment failed due to lack idBlog",
        };
      } else {
        const blog = await Blog.findById(idBlog);
        if (!blog) {
          status = 404;
          data = {
            success: false,
            message: "Read comment failed, blog not found",
          };
        } else {
          const comments = await Comment.find({ blog: idBlog });
          status = 200;
          data = {
            success: true,
            message: "Read comment successfully",
            data: comments,
          };
        }
      }
    } catch (error) {
      data = error;
    }
    res.status(status).json(data);
  },
  deleteComment: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idBlog = req.query.idBlog;
      const idComment = req.query.idComment;
      const account = await adminController.checkAccountById(req.user.id);

      let comments = account.comments;
      let blogs = account.blogs;

      const commentArray = comments.map((comment) => comment._id);
      const blogArray = blogs.map((blog) => blog._id);

      if (!idBlog) {
        status = 404;
        data = {
          success: false,
          message: "Delete comment failed due to lack idBlog",
        };
      } else {
        const blog = await Blog.findById(idBlog);
        if (!blog) {
          status = 404;
          data = {
            success: false,
            message: "Delete comment failed, blog not found",
          };
        } else {
          if (!idComment) {
            status = 404;
            data = {
              success: false,
              message: "Delete comment failed due to lack idComment",
            };
          } else {
            const comment = await Comment.findById(idComment);
            if (!comment) {
              status = 404;
              data = {
                success: false,
                message: "Delete comment failed, comment not found",
              };
            } else {
              if (
                blogArray.some((id) => id.equals(idBlog)) ||
                commentArray.some((id) => id.equals(idComment))
              ) {
                const acByComment = await adminController.checkAccountByComment(
                  idComment
                );
                // console.log(acByComment);
                await comment.delete();
                await account.updateOne({
                  $pull: {
                    comments: idComment,
                  },
                });
                await blog.updateOne({
                  $pull: {
                    comments: idComment,
                  },
                });

                await acByComment.updateOne({
                  $pull: {
                    comments: idComment,
                  },
                });
                status = 200;
                data = {
                  success: true,
                  message: "Delete comment successfully",
                };
              } else {
                status = 403;
                data = {
                  success: false,
                  message: "You do not have permission to delete this comment",
                };
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
      data = error;
    }
    res.status(status).json(data);
  },
  updateComment: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idBlog = req.query.idBlog;
      const idComment = req.query.idComment;
      const account = await adminController.checkAccountById(req.user.id);
      let content = req.body.content;

      let comments = account.comments;

      const commentArray = comments.map((comment) => comment._id);
      if (!idBlog) {
        status = 404;
        data = {
          success: false,
          message: "Update comment failed due to lack idBlog",
        };
      } else {
        const blog = await Blog.findById(idBlog);
        if (!blog) {
          status = 404;
          data = {
            success: false,
            message: "Update comment failed, blog not found",
          };
        } else {
          if (!idComment) {
            status = 404;
            data = {
              success: false,
              message: "Update comment failed due to lack idComment",
            };
          } else {
            const comment = await Comment.findById(idComment);
            if (!comment) {
              status = 404;
              data = {
                success: false,
                message: "Update comment failed, comment not found",
              };
            } else {
              if (content == undefined || content == "") {
                content = comment.content;
              }
              console.log(content);
              if (commentArray.some((id) => id.equals(idComment))) {
                await comment.updateOne({
                  $set: {
                    content: content,
                  },
                });
                status = 200;
                data = {
                  success: true,
                  message: "Updated comment successfully",
                };
              } else {
                status = 403;
                data = {
                  success: false,
                  message: "You do not have permission to update this comment",
                };
              }
            }
          }
        }
      }
    } catch (error) {
      data = error;
      console.log(data);
    }
    res.status(status).json(data);
  },
};
module.exports = commentController;
