const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 30,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: true,
    },
    warehouses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    isActive: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dborrd4h5/image/upload/v1698906766/WarehouseManagement/avatars/trend-avatar-1_xdqcvy.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
