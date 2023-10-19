const User = require("../models/User");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    try {
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

        const user = await newUser.save();
        res.status(200).json(user);
      } else {
        res.status(404).json("errs pass");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong username");
      }
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
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = authController;
