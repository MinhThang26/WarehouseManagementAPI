const mongoose = require("mongoose");

const wareHouseSchema = mongoose.Schema(
  {
    wareHouseName: {
      type: String,
      required: true,
      unique: true,
      
    },
    address: {
        type: String,
        required: true,
      },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WarehouseCategory",
    },
    capacity: {
      type: String,
    },
    
    monney: {
      type: Number,
      required: true,
      
    },
    status: {
        type: String,
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", wareHouseSchema);
