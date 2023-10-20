const User = require("../models/User");
const Admin = require("../models/Admin");
const Staff = require("../models/Staff");
const Owner = require("../models/Owner");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      const staff = await Staff.findOne({ username: req.body.username });
      const owner = await Owner.findOne({ username: req.body.username });
      const admin = await Admin.findOne({ username: req.body.username });
      if (!user && !staff && !owner && !admin) {
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
        } else {
          res.status(404).json("errs pass");
        }
      } else {
        res.status(500).json("username has been registered");
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
            res.status(200).json(user);
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
            res.status(200).json(staff);
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
            res.status(200).json(owner);
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
            res.status(200).json(admin);
          }
        } else {
          res.status(404).json("Wrong username");
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = authController;
