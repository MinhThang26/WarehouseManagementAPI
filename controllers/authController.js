const User = require("../models/User");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");
const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authController = {
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
      },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "2h",
      }
    );
  },
  registerUser: async (req, res) => {
    // try {
    //   const user = await User.findOne({
    //     $or: [{ username: req.body.username }, { email: req.body.email }],
    //   });
    //   const staff = await Staff.findOne({ username: req.body.username });
    //   const owner = await Owner.findOne({ username: req.body.username });
    //   const admin = await Admin.findOne({ username: req.body.username });
    //   console.log(user);

    //   if (!user && !staff && !owner && !admin) {
    //     if (req.body.password === req.body.confirmPassword) {
    //       const salt = await bcrypt.genSalt(10);
    //       const hashed = await bcrypt.hash(req.body.password, salt);

    //       const newUser = await new User({
    //         username: req.body.username,
    //         email: req.body.email,
    //         address: req.body.address,
    //         phone: req.body.phone,
    //         password: hashed,
    //       });

    //       const user1 = await newUser.save();
    //       res.status(200).json(user1);
    //     } else if (
    //       req.body.password == undefined ||
    //       req.body.confirmPassword == undefined
    //     ) {
    //       res.status(401).json("Missing password or confirm password");
    //     } else {
    //       res
    //         .status(401)
    //         .json("Password and confirm password are not the same");
    //     }
    //   } else {
    //     res.status(500).json("username has been registered");
    //   }
    // } catch (error) {
    //   res.status(500).json(error);
    // }

    try {
      const property = await authController.isUsernameOrEmailOrPhoneTaken(
        req.body.username,
        req.body.email,
        req.body.phone
      );

      if (property) {
        res.status(401).json(property + " property is duplicated");
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
        res.status(200).json(user1);
      } else if (
        req.body.password == undefined ||
        req.body.confirmPassword == undefined
      ) {
        res.status(401).json("Missing password or confirm password");
      } else {
        res.status(401).json("Password and confirm password are not the same");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      const staff = await Staff.findOne({ username: req.body.username });
      const owner = await Owner.findOne({ username: req.body.username });
      const admin = await Admin.findOne({ username: req.body.username });

      {
        if (user) {
          const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!validPassword) {
            res.status(404).json("Wrong password");
          }
          if (user && validPassword) {
            const accessToken = authController.generateAccessToken(user);
            res.status(200).json({ user, accessToken });
          }
        } else if (staff) {
          const validPassword = await bcrypt.compare(
            req.body.password,
            staff.password
          );
          if (!validPassword) {
            res.status(404).json("Wrong password");
          }
          if (staff && validPassword) {
            const accessToken = authController.generateAccessToken(staff);
            res.status(200).json({ staff, accessToken });
          }
        } else if (owner) {
          const validPassword = await bcrypt.compare(
            req.body.password,
            owner.password
          );
          if (!validPassword) {
            res.status(404).json("Wrong password");
          }
          if (owner && validPassword) {
            const accessToken = authController.generateAccessToken(owner);
            res.status(200).json({ owner, accessToken });
          }
        } else if (admin) {
          const validPassword = await bcrypt.compare(
            req.body.password,
            admin.password
          );
          if (!validPassword) {
            res.status(404).json("Wrong password");
          }
          if (admin && validPassword) {
            const accessToken = authController.generateAccessToken(admin);
            res.status(200).json({ admin, accessToken });
          }
        } else {
          res.status(404).json("Wrong username");
        }
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
