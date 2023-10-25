const mongoose = require("mongoose");

const staffSchema = mongoose.Schema(
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
    phone: {
      type: Number,
      required: true,
    },
    isStaff: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
