const mongoose = require("mongoose");

const WarehouseCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WarehouseCategory", WarehouseCategorySchema);
