const mongoose = require("mongoose");

const WarehouseCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    warehouses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("WarehouseCategory", WarehouseCategorySchema);
