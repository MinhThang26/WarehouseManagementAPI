const User = require("../models/User");
const Staff = require("../models/Staff");
const Owner = require("../models/Owner");

const adminController = {
  activateAccountOwner: async (req, res) => {
    try {
      const idOwner = req.query.idOwner;
      const owner = await Owner.findById(idOwner);

      if (owner) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await owner.updateOne({ $set: { isActive: true } });

        res.status(200).json({ message: "Activate account owners successful" });
      } else {
        res.status(404).json({ message: "This owner account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deactivateAccountOwner: async (req, res) => {
    try {
      const idOwner = req.query.idOwner;
      const owner = await Owner.findById(idOwner);

      if (owner) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await owner.updateOne({ $set: { isActive: false } });

        res
          .status(200)
          .json({ message: "DeActivate account owners successful" });
      } else {
        res.status(404).json({ message: "This owner account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  activateAccountStaff: async (req, res) => {
    try {
      const idStaff = req.query.idStaff;
      const staff = await Staff.findById(idStaff);

      if (staff) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await staff.updateOne({ $set: { isActive: true } });

        res.status(200).json({ message: "Activate account staff successful" });
      } else {
        res.status(404).json({ message: "This staff account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deactivateAccountStaff: async (req, res) => {
    try {
      const idStaff = req.query.idStaff;
      const staff = await Staff.findById(idStaff);

      if (staff) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await staff.updateOne({ $set: { isActive: false } });

        res
          .status(200)
          .json({ message: "DeActivate account staff successful" });
      } else {
        res.status(404).json({ message: "This staff account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  activateAccountStaffs: async (req, res) => {
    try {
      const idStaffs = req.query.idStaff;

      if (idStaffs) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await Staff.updateMany(
          { _id: { $in: idStaffs } },
          { $set: { isActive: true } }
        );

        res.status(200).json({ message: "Activate account staff successful" });
      } else {
        res.status(404).json({ message: "This staff account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deactivateAccountStaffs: async (req, res) => {
    try {
      const idStaffs = req.query.idStaff;

      if (idStaffs) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await Staff.updateMany(
          { _id: { $in: idStaffs } },
          { $set: { isActive: false } }
        );

        res
          .status(200)
          .json({ message: "DeActivate account staff successful" });
      } else {
        res.status(404).json({ message: "This staff account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  activateAccountOwners: async (req, res) => {
    try {
      const idOwners = req.query.idOwner;

      if (idOwners) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await Owner.updateMany(
          { _id: { $in: idOwners } },
          { $set: { isActive: true } }
        );

        res.status(200).json({ message: "Activate account owners successful" });
      } else {
        res.status(404).json({ message: "This owner account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deactivateAccountOwners: async (req, res) => {
    try {
      const idOwners = req.query.idOwner;

      if (idOwners) {
        // Tìm và cập nhật staffs có id nằm trong danh sách idStaffs
        await Owner.updateMany(
          { _id: { $in: idOwners } },
          { $set: { isActive: false } }
        );

        res
          .status(200)
          .json({ message: "DeActivate account owners successful" });
      } else {
        res.status(404).json({ message: "This owner account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = adminController;
