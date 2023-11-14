const uploadCloud = require("../config/cloudinaryConfig");
const Blog = require("../models/Blog");
const Owner = require("../models/Owner");
const blogController = {
  createBlog: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const id = req.user.id;
      const owner = await Owner.findById(id);
      const warehouse = req.query.warehouse;

      if (warehouse) {
        if (owner.warehouses.includes(warehouse)) {
          const images = await blogController.uploadImages(req);
          const imagePath = images.map((image) => image.path);
          // console.log(imagePath);

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
  uploadImages: (req) => {
    return new Promise((resolve, reject) => {
      uploadCloud.array("images")(req, null, (error) => {
        if (error) {
          console.error("Có lỗi khi tải lên ảnh:", error);
          reject("Có lỗi khi tải lên ảnh");
        } else {
          resolve(req.files);
        }
      });
    });
  },
};

module.exports = blogController;
