const uploadCloud = require("../config/cloudinaryConfig");
const Blog = require("../models/Blog");
const Owner = require("../models/Owner");
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
      const owner = await Owner.findById(id);
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
        //const blog2 = await Warehouse.updateOne({ $pull: { warehouses: id } });
        console.log(id);
        console.log(blog1);
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

      if (idBlog) {
        const blog = await Blog.findById(idBlog);
        if (!blog) {
          data = {
            success: false,
            message: "Blog update failed, blog not found",
          };
        } else {
          if (idOwner != blog.owner) {
            data = {
              success: false,
              message:
                "Blog update failed, this blog does not belong to this account owner",
            };
          } else {
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
              images: imagePath,
            });

            status = 200;
            data = {
              success: true,
              message: "Update blog a successful blog",
            };
          }
        }
      } else {
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
};

module.exports = blogController;
