const User = require("../models/User");
const Staff = require("../models/Staff");
const Owner = require("../models/Owner");
const _ = require("lodash");

const adminController = {
  checkAccountById: async (id) => {
    const user = await User.findById(id);
    const staff = await Staff.findById(id);
    const owner = await Owner.findById(id);
    if (user) {
      return user;
    } else if (staff) {
      return staff;
    } else if (owner) {
      return owner;
    }
  },

  getAllAccountByIsActive: async (req, res) => {
    try {
      const owners = await Owner.find({ isActive: true });
      const staffs = await Staff.find({ isActive: true });
      const users = await User.find({ isActive: true });
      const accounts = _.shuffle(owners.concat(staffs, users));
      if (accounts) {
        res.status(200).json({
          message: "Read the list of successfully activated accounts",
          accounts: accounts,
        });
      } else {
        res.status(404).json({
          message: "Read the list of unsuccessfully activated accounts",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllAccountByIsNotActive: async (req, res) => {
    try {
      const owners = await Owner.find({ isActive: false });
      const staffs = await Staff.find({ isActive: false });
      const users = await User.find({ isActive: false });
      const accounts = _.shuffle(owners.concat(staffs, users));
      if (accounts) {
        res.status(200).json({
          message: "Read the list of successfully activated accounts",
          accounts: accounts,
        });
      } else {
        res.status(404).json({
          message: "Read the list of unsuccessfully activated accounts",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  activateAccount: async (req, res) => {
    try {
      const account = await adminController.checkAccountById(req.query.id);
      if (account) {
        await account.updateOne({
          $set: {
            isActive: true,
          },
        });
        res.status(200).json({ message: "Successfully activated account" });
      } else {
        res
          .status(500)
          .json({ message: "The account has been activated unsuccessfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deactivateAccount: async (req, res) => {
    try {
      const account = await adminController.checkAccountById(req.query.id);
      if (account) {
        await account.updateOne({
          $set: {
            isActive: false,
          },
        });
        res.status(200).json({ message: "Successfully deactivated account" });
      } else {
        res
          .status(404)
          .json({ message: "The account has been deactivated unsuccessfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  activateMultipleAccounts: async (req, res) => {
    try {
      const ids = req.query.id;

      if (ids) {
        await User.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: true } }
        );
        await Staff.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: true } }
        );
        await Owner.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: true } }
        );

        res
          .status(200)
          .json({ message: "Successfully activated many account" });
      } else {
        res
          .status(404)
          .json({ message: "The account has been activated unsuccessfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deactivateMultipleAccounts: async (req, res) => {
    try {
      const ids = req.query.id;
      if (ids) {
        await User.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: false } }
        );
        await Staff.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: false } }
        );
        await Owner.updateMany(
          { _id: { $in: ids } },
          { $set: { isActive: false } }
        );
        res.status(200).json({ message: "Successfully deactivated account" });
      } else {
        res
          .status(404)
          .json({ message: "The account has been deactivated unsuccessfully" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = adminController;
