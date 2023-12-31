const WarehouseCategory = require("../models/WarehouseCategory");
const warehouseCategoryController = {
  getAllCategory: async (req, res) => {
    try {
      // const categories = await WarehouseCategory.find().populate("warehouses");
      const categories = await WarehouseCategory.find().populate({
        path: "warehouses",
        select: "wareHouseName",
        populate: {
          path: "owner",
          select: "username",
        },
      });

      if (categories) {
        res.status(200).json({
          success: true,
          message: "View warehouse categories data successfully",
          categories: categories,
        });
      } else {
        res
          .status(400)
          .json({
            success: false,
            message: "View warehouse category data failed",
          });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = warehouseCategoryController;
