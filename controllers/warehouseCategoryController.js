const WarehouseCategory = require("../models/WarehouseCategory");
const warehouseCategoryController = {
  getAllCategory: async (req, res) => {
    try {
      const categories = await WarehouseCategory.find();
      if (categories) {
        res.status(200).json({
          message: "View warehouse categories data successfully",
          categories: categories,
        });
      } else {
        res
          .status(404)
          .json({ message: "View warehouse category data failed" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = warehouseCategoryController;