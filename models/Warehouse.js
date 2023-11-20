const mongoose = require("mongoose");

const wareHouseSchema = mongoose.Schema(
  {
    wareHouseName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseCategory",
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    currentCapacity:{
      type: Number,
    },
    monney: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    imageWarehouse:{
      type: String,
      require: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", wareHouseSchema);
