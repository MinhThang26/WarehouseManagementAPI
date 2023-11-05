const User = require("../models/User");
const Owner = require("../models/Owner");
const _ = require("lodash");

const adminController = {
  checkAccountById: async (id) => {
    const user = await User.findById(id);
    const owner = await Owner.findById(id);
    if (user) {
      return user;
    } else if (owner) {
      return owner;
    }
  },
  getAllAccountByIsActivate: async (req, res) => {
    try {
      const owners = await Owner.find({ isActive: true });
      const users = await User.find({ isActive: true });
      const accounts = _.shuffle(owners.concat(users));

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
  getAllAccountByNotActivate: async (req, res) => {
    try {
      const owners = await Owner.find({ isActive: false });
      const users = await User.find({ isActive: false });
      const accounts = _.shuffle(owners.concat(users));

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
          .status(404)
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
  getAllOwnerByIsActivate: async (req, res) => {
    try {
      const owners = await Owner.find({ isActive: true });
      if (owners) {
        res.status(200).json({
          message: "Read the list of successfully activated accounts owner",
          owners: owners,
        });
      } else {
        res.status(404).json({
          message: "Read the list of unsuccessfully activated accounts owner",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllOwnerByNotActivate: async (req, res) => {
    try {
      const owners = await Owner.find({ isActive: false });
      if (owners) {
        res.status(200).json({
          message: "Read the list of successfully activated accounts owner",
          owners: owners,
        });
      } else {
        res.status(404).json({
          message: "Read the list of unsuccessfully activated accounts owner",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllUserByIsActivate: async (req, res) => {
    try {
      const users = await User.find({ isActive: true });
      if (users) {
        res.status(200).json({
          message: "Read the list of successfully activated accounts users",
          users: users,
        });
      } else {
        res.status(404).json({
          message: "Read the list of unsuccessfully activated accounts users",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAllUserByNotActivate: async (req, res) => {
    try {
      const users = await User.find({ isActive: false });
      if (users) {
        res.status(200).json({
          message: "Read the list of successfully activated accounts users",
          users: users,
        });
      } else {
        res.status(404).json({
          message: "Read the list of unsuccessfully activated accounts users",
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = adminController;
