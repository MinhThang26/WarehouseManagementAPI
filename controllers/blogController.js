const uploadCloud = require("../config/cloudinaryConfig");
const Blog = require("../models/Blog");
const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const Comment = require("../models/Comment");
const { login } = require("./authController");
const blogController = {
  uploadImages: (req) => {
    return new Promise((resolve, reject) => {
      uploadCloud.array("images")(req, null, (error) => {
        if (error) {
          console.error("Có lỗi khi tải lên ảnh:", error);
          reject("Có lỗi khi tải lên ảnh");
        } else {
          if (req.files == undefined) {
            req.files = [];
          }
          resolve(req.files);
        }
      });
    });
  },
  createBlog: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const id = req.user.id;
      const warehouse = req.query.warehouse;
      const owner = await Owner.findById(id);
      if (warehouse) {
        if (owner.warehouses.includes(warehouse)) {
          const images = await blogController.uploadImages(req);
          const imagePath = images.map((image) => image.path);
          const checkData = blogController.checkDataBlog(
            req.body.description,
            imagePath
          );

          if (checkData) {
            status = 400;
            data = {
              success: false,
              message: "Create a blog failed, must have images or description",
            };
          } else {
            const newBlog = await new Blog({
              owner: id,
              warehouse: warehouse,
              description: req.body.description,
              images: imagePath,
            });
            const saveBlog = await newBlog.save();
            await owner.updateOne({ $push: { blogs: saveBlog._id } });
            status = 200;
            data = {
              success: true,
              message: "Create a successful blog",
              data: saveBlog,
            };
          }
        } else {
          status = 400;
          data = {
            success: false,
            message: "This warehouse does not belong to this account owner",
          };
        }
      } else {
        status = 400;
        data = {
          success: false,
          message: "Blog creation failed due to lack warehouse",
        };
      }
    } catch (error) {
      console.log(error);
      data = error;
    }
    res.status(status).json(data);
  },
  getBlogById: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idBlog = req.query.id;
      if (!idBlog) {
        status = 404;
        data = {
          success: false,
          message: "Read blog failed due to lack idBlog",
        };
      } else {
        const blog = await Blog.findById(idBlog)
          .populate("owner")
          .populate("warehouse");
        if (!blog) {
          status = 404;
          data = {
            success: false,
            message: "Read blog failed, blog not found",
          };
        } else {
          status = 200;
          data = {
            success: true,
            message: "Read blog successfully",
            data: blog,
          };
        }
      }
    } catch (error) {
      data = error;
    }
    res.status(status).json(data);
  },
  getListBlogByOwner: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idOwner = req.query.id;
      if (!idOwner) {
        status = 404;
        data = {
          success: false,
          message: "Read list blog by owner failed due to lack idOwner",
        };
      } else {
        const blogs = await Blog.find({ owner: idOwner })
          .populate("owner")
          .populate("warehouse");

        if (blogs.length == 0) {
          status = 400;
          data = {
            success: false,
            message: "Read list blog by owner failed, blogs not found",
          };
        } else {
          status = 200;
          data = {
            success: true,
            message: "Read list blog by owner successfully",
            data: blogs,
          };
        }
      }
    } catch (error) {
      data = error;
    }
    res.status(status).json(data);
  },
  deleteBlog: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idOwner = req.query.id_owner;
      if (idOwner) {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);
        const blog1 = await Owner.updateMany({ $pull: { blogs: id } });
        const blog2 = await Comment.findOne({ blog: id });
        console.log(blog2);
        if (blog2 === "null" || blog2 == "") {
          console.log(blog2);
          await blog2.delete();
        }
        if (blog && blog1) {
            status = 200;
            data = {
              success: true,
              message: "Delete blog successfully!",
            };
          } else {
            status = 404;
            data = {
              success: false,
              message: `cannot find any blog`,
            };
          }

      } else {
        status = 401;
        data = {
          success: false,
          message: "Xoa blog không thành công vì không phải là chủ kho",
        };
      }
    } catch (error) {
      data = error;
    }
    console.log(data)
    res.status(status).json(data);
  },
  getListBlogByAll: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const blog = await Blog.find().populate("warehouse").populate("owner");
      if (blog) {
        status = 200;
        data = {
          success: true,
          message: "View blog data successfully",
          blog: blog,
        };
      } else {
        status = 404;
        data = {
          success: false,
          message: "View blog data failed",
        };
      }
    } catch (error) {
      data = error;
    }
    res.status(status).json(data);
  },
  updateBlog: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idOwner = req.user.id;
      const idBlog = req.query.id;
      let warehouse = req.query.warehouse;
      const owner = await Owner.findById(idOwner);

      if (idBlog) {
        const blog = await Blog.findById(idBlog);
        if (!blog) {
          status = 400;
          data = {
            success: false,
            message: "Blog update failed, blog not found",
          };
        } else {
          if (idOwner != blog.owner) {
            status = 400;
            data = {
              success: false,
              message:
                "Blog update failed, this blog does not belong to this account owner",
            };
          } else {
            if (warehouse == "" || warehouse == undefined) {
              warehouse = blog.warehouse;
            }
            if (owner.warehouses.includes(warehouse)) {
              console.log(warehouse);
              const images = await blogController.uploadImages(req);
              let imagePath = images.map((image) => image.path);
              let description = req.body.description;
              if (imagePath.length == 0) {
                imagePath = blog.images;
              }
              if (description == "" || description == undefined) {
                description = blog.description;
              }
              await blog.updateOne({
                description: description,
                warehouse: warehouse,
                images: imagePath,
              });
              status = 200;
              data = {
                success: true,
                message: "Update blog a successful blog",
              };
            } else {
              status = 400;
              data = {
                success: false,
                message: "This warehouse does not belong to this account owner",
              };
            }
          }
        }
      } else {
        status = 400;
        data = {
          success: false,
          message: "Blog update failed due to lack id blog",
        };
      }
    } catch (error) {
      console.log(error);
      data = error;
    }
    res.status(status).json(data);
  },
  checkDataBlog: (description, images) => {
    let response;
    const checkNullDescription =
      description == undefined || description == "" || description.length == 0;
    const checkNullImages =
      images == undefined || images == "" || images.length == 0;
    if (checkNullDescription && checkNullImages) {
      response = "Update a blog failed, must have images or description";
    }
    return response;
  },
  likeBlog: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const { id } = req.user;
      const { bid } = req.params;
      console.log(bid)
      if (!bid) {
        status = 400;
        data = {
          success: false,
          message: "Blog upBlog id not found or invalid blog iddate failed due to lack id blog",
        };
      }
      const blog = await Blog.findById(bid);
      const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === id);
      //Kiểm tra người dùng trước đó có dislike không -> bỏ dislike
      if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: id } }, { new: true });
        if (response) {
          status = 200;
          data = {
            success: true,
            blog: response,
          };
        } else {
          status = 404;
          data = {
            success: false,
            message: "Blog data failed",
          };
        }
      }
      //Kiểm tra xem người đó có trước có like hay không -> bỏ like / thêm like
      const isLiked = blog?.likes?.find(el => el.toString() === id);
      if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: id } }, { new: true });
        if (response) {
          status = 200;
          data = {
            success: true,
            blog: response,
          };
        } else {
          status = 404;
          data = {
            success: false,
            message: "Blog data failed",
          };
        }
      } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: id } }, { new: true });
        if (response) {
          status = 200;
          data = {
            success: true,
            blog: response,
          };
        } else {
          status = 404;
          data = {
            success: false,
            message: "Blog data failed",
          };
        }
      }
    } catch {
      data = error;
    }
    res.status(status).json(data);
  },
  disLikeBlog: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const { id } = req.user;
      const { bid } = req.params;
      console.log(bid)
      if (!bid) {
        status = 400;
        data = {
          success: false,
          message: "Blog upBlog id not found or invalid blog iddate failed due to lack id blog",
        };
      }
      const blog = await Blog.findById(bid);
      const alreadyLiked = blog?.likes?.find(el => el.toString() === id);
      //Kiểm tra người dùng trước đó có like không -> bỏ like
      if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: id } }, { new: true });
        if (response) {
          status = 200;
          data = {
            success: true,
            blog: response,
          };
        } else {
          status = 404;
          data = {
            success: false,
            message: "Blog data failed",
          };
        }
      }
      //Kiểm tra xem người đó có trước có dislike hay không -> bỏ dislike / thêm dislike
      const isDisLiked = blog?.dislikes?.find(el => el.toString() === id);
      if (isDisLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: id } }, { new: true });
        if (response) {
          status = 200;
          data = {
            success: true,
            blog: response,
          };
        } else {
          status = 404;
          data = {
            success: false,
            message: "Blog data failed",
          };
        }
      } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: id } }, { new: true });
        if (response) {
          status = 200;
          data = {
            success: true,
            blog: response,
          };
        } else {
          status = 404;
          data = {
            success: false,
            message: "Blog data failed",
          };
        }
      }
    } catch {
      data = error;
    }
    res.status(status).json(data);
  },

};

module.exports = blogController;
