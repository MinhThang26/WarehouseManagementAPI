const User = require("../models/User");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");
const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
  isUsernameTaken: async (username) => {
    const user = await User.findOne({ username });
    const staff = await Staff.findOne({ username });
    const owner = await Owner.findOne({ username });
    const admin = await Admin.findOne({ username });
    if (user) {
      return user;
    } else if (staff) {
      return staff;
    } else if (owner) {
      return owner;
    } else if (admin) {
      return admin;
    }
    return null;
  },
  isUsernameOrEmailOrPhoneTaken: async (username, email, phone) => {
    var property;

    const user = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });
    const staff = await Staff.findOne({
      $or: [{ username }, { email }, { phone }],
    });
    const owner = await Owner.findOne({
      $or: [{ username }, { email }, { phone }],
    });
    const admin = await Admin.findOne({ username });

    if (user) {
      if (username === user.username) {
        property = "username";
      } else if (email === user.email) {
        property = "email";
      } else if (parseFloat(phone) === user.phone) {
        property = "phone";
      }
    }
    if (staff) {
      if (username === staff.username) {
        property = "username";
      } else if (email === staff.email) {
        property = "email";
      } else if (phone === staff.phone) {
        property = "phone";
      }
    }
    if (owner) {
      if (username === owner.username) {
        property = "username";
      } else if (email === owner.email) {
        property = "email";
      } else if (phone === owner.phone) {
        property = "phone";
      }
    }
    if (admin) {
      if (username === admin.username) {
        property = "username";
      }
    }
    return property;
  },
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        isStaff: user.isStaff,
        isOwner: user.isOwner,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "2h",
      }
    );
  },
  registerUser: async (req, res) => {
    try {
      const property = await authController.isUsernameOrEmailOrPhoneTaken(
        req.body.username,
        req.body.email,
        req.body.phone
      );

      if (property) {
        res.status(401).json({ message: property + " has been registered" });
        return;
      }

      if (req.body.password === req.body.confirmPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        const newUser = await new User({
          username: req.body.username,
          email: req.body.email,
          address: req.body.address,
          phone: req.body.phone,
          password: hashed,
        });

        const user1 = await newUser.save();
        res
          .status(200)
          .json({ message: "Successfully registered account", user: user1 });
      } else if (
        req.body.password == undefined ||
        req.body.confirmPassword == undefined
      ) {
        res
          .status(401)
          .json({ message: "Missing password or confirm password" });
      } else {
        res
          .status(401)
          .json({ message: "Password and confirm password are not the same" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await authController.isUsernameTaken(req.body.username);
      if (user) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (validPassword) {
          const accessToken = await authController.generateAccessToken(user);
          const { password, ...others } = user._doc;

          res.status(200).json({
            message: "Logged in successfully",
            others: others,
            accessToken: accessToken,
          });
        } else {
          res.status(401).json({ message: "Password is not valid" });
        }
      } else {
        res.status(401).json({ message: "Password is not valid" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  logout: async (req, res) => {
    res.status(200).json("Logged out");
  },
};
module.exports = authController;
