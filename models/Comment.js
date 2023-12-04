const mongoose = require("mongoose");
const Owner = require("./Owner");
const User = require("./User");
const adminController = require("../controllers/adminController");
const commentSchema = mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "accountRef",
    },
    accountRef: {
      type: String,
    },

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
    },
  },
  { timestamps: true }
);

commentSchema.pre("save", async function (next) {
  // Lấy thông tin Owner hoặc User từ trường account
  const ownerOrUser = await adminController.checkAccountById(this.account);
  console.log(ownerOrUser);
  // Xác định giá trị ref dựa vào thuộc tính isOwner

  this.accountRef = ownerOrUser.isOwner ? "Owner" : "User";
  console.log(this.accountRef);
  next();
});

module.exports = mongoose.model("Comment", commentSchema);
