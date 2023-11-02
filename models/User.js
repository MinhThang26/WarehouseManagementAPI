const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
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
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dborrd4h5/image/upload/v1698906766/WarehouseManagement/avatars/trend-avatar-1_xdqcvy.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
