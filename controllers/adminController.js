const User = require("../models/User");
const Staff = require("../models/Staff");
const Owner = require("../models/Owner");

const adminController = {
  activateAccountOwner: async (req, res) => {
    try {
      const idOwner = req.query.idOwner;
      const isActive = req.body.isActive;
      const owner = await Owner.findById(idOwner);
      if (owner) {
        if (isActive === "true") {
          await owner.updateOne({
            $set: {
              isActive: JSON.parse(req.body.isActive),
            },
          });
          res
            .status(200)
            .json({ message: "Activate account owner successful" });
        } else if (isActive === "false") {
          await owner.updateOne({
            $set: {
              isActive: JSON.parse(req.body.isActive),
            },
          });
          res
            .status(200)
            .json({ message: "Deactivate account owner successful" });
        } else {
          res.status(404).json({ message: "Not found" });
        }
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
      const isActive = req.body.isActive;
      const staff = await Staff.findById(idStaff);

      if (staff) {
        if (isActive === "true") {
          await staff.updateOne({
            $set: {
              isActive: JSON.parse(req.body.isActive),
            },
          });
          res
            .status(200)
            .json({ message: "Activate account staff successful" });
        } else if (isActive === "false") {
          await staff.updateOne({
            $set: {
              isActive: JSON.parse(req.body.isActive),
            },
          });
          res
            .status(200)
            .json({ message: "Deactivate account staff successful" });
        } else {
          res.status(404).json({ message: "Not found" });
        }
      } else {
        res.status(404).json({ message: "This staff account does not exist" });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = adminController;
