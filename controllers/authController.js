const User = require("../models/User");
const Admin = require("../models/Admin");
const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/Token");
const adminController = require("./adminController");

const authController = {
  isUsernameTaken: async (username) => {
    const user = await User.findOne({ username });
    const owner = await Owner.findOne({ username });
    const admin = await Admin.findOne({ username });
    if (user) {
      return user;
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

    if (owner) {
      if (username === owner.username) {
        property = "username";
      } else if (email === owner.email) {
        property = "email";
      } else if (parseFloat(phone) === owner.phone) {
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
        isOwner: user.isOwner,
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "2h",
      }
    );
  },
  register: async (req, res) => {
    try {
      const status = req.query.status;

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

        if (status == 0) {
          const newOwner = await new Owner({
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            password: hashed,
          });

          const owner = await newOwner.save();
          console.log();
          res
            .status(200)
            .json({ message: "Successfully registered account", owner });
        } else if (status == 1) {
          const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            address: req.body.address,
            phone: req.body.phone,
            password: hashed,
          });

          const user = await newUser.save();
          res
            .status(200)
            .json({ message: "Successfully registered account", user });
        } else {
          res.status(404).json({ message: "Not Found" });
        }
      } else if (
        req.body.password == undefined ||
        req.body.confirmPassword == undefined
      ) {
        res
          .status(401)
          .json({ message: "Missing password or confirm password" });
      } else {
        res.status(401).json({
          message: "Password and confirm password are not the same",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  login: async (req, res) => {
    try {
      const user = await authController.isUsernameTaken(req.body.username);
      if (user) {
        if (user.isActive) {
          const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (validPassword) {
            const accessToken = await authController.generateAccessToken(user);
            const token = new Token({
              token: accessToken,
            });
            await token.save();
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
          res.status(401).json({ message: "Account has not been activated" });
        }
      } else {
        res.status(401).json({ message: "Username is not valid" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  logout: async (req, res) => {
    try {
      const token = req.headers.authorization;

      if (token) {
        const tokenAccess = token.split(" ")[1];
        await Token.deleteOne({ token: tokenAccess });
        res.status(200).json({ message: "Signed out successfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateAccount: async (req, res) => {
    try {
      const account = await adminController.checkAccountById(req.user.id);

      const property = await authController.isUsernameOrEmailOrPhoneTaken(
        req.body.username,
        req.body.email,
        req.body.phone
      );
      const avatar = req.file;
      if (account) {
        if (!property) {
          if (avatar) {
            await account.updateOne({
              $set: {
                email: req.body.email,
                address: req.body.address,
                avatar: avatar.path,
                phone: req.body.phone,
              },
            });
            res.status(200).json({ message: "Updated account successfully" });
          } else {
            await account.updateOne({
              $set: {
                email: req.body.email,
                address: req.body.address,
                phone: req.body.phone,
              },
            });
            res.status(200).json({ message: "Updated account successfully" });
          }
        } else {
          res.status(404).json({ message: property + " has been registered" });
        }
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const account = await adminController.checkAccountById(req.user.id);

      if (account) {
        const validPassword = await bcrypt.compare(
          req.body.password,
          account.password
        );
        if (!validPassword) {
          if (req.body.password === req.body.confirmPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            await account.updateOne({
              $set: {
                password: hashed,
              },
            });
            res
              .status(200)
              .json({ message: "Change password account successfully" });
          } else {
            res.status(401).json({
              message: "Password and confirm password are not the same",
            });
          }
        } else {
          res.status(401).json({
            message: "The new password cannot be the same as the old password",
          });
        }
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAccountById: async (req, res) => {
    try {
      const account = await adminController.checkAccountById(req.user.id);

      if (account) {
        const { password, ...others } = account._doc;
        res
          .status(200)
          .json({ message: "Read data account successfully", others: others });
      } else {
        res.status(404).json({ message: "Account not found" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = authController;
