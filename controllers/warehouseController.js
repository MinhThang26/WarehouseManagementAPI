const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const WarehouseCategory = require("../models/WarehouseCategory");

const WarehouseController = {
    //ADD WAREHOUSE
    addWarehouse: async (req, res) => {
        try {
            const idOwner = req.query.id_owner;
            if (idOwner) {
                const newWarehouse = new Warehouse(req.body);
                const saveWarehouse = await newWarehouse.save();
                if (req.body.owner) {
                    const owner = Owner.findById(req.body.owner);
                    await owner.updateOne({ $push: { warehouses: saveWarehouse._id } });
                }
                if (req.body.category) {
                    const category = WarehouseCategory.findById(req.body.category);
                    await category.updateOne({ $push: { warehouses: saveWarehouse._id } });
                }
                res.status(200).json(saveWarehouse);
            }
            else {
                res.status(404).json({ message: "thêm không thành công do không phải là chủ kho" });
            }
        }
        catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },


    getAllWarehouses: async (req, res) => {

        try {
            const idOwner = req.query.id_owner;
            if (idOwner) {
                const warehouses = await Warehouse.find();
                if (warehouses) {
                    res.status(200).json({
                        message: "View warehouse data successfully",
                        warehouses: warehouses,
                    });
                }
                else {
                    res
                        .status(404)
                        .json({ message: "View warehouse data failed" });
                }
            }
            else {
                res.status(401).json({ message: "xem danh sách kho không thành công vì khongo phải là chủ kho" })
            }


        } catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },

    //UPDATE WAREHOUSE
    updateWarehouse: async (req, res) => {
        try {
            const warehouses = await Warehouse.findById(req.params.id);
            if (warehouses) {
                await warehouses.updateOne({ $set: req.body });
                res.status(200).json("Updated warehouse successfully!");
            }
            else {
                res.status(404).json({ message: "View warehouse data failed" });
            }
        } catch (err) {
            res.status(500).json({ message: error.message });
        }
    },

    //DELETE WAREHOUSE
    deleteWarehouse: async (req, res) => {
        try {
            const { id } = req.params;
            const warehouses = await Warehouse.findByIdAndDelete(id);

            const warehouses1 = await Owner.updateOne({ $pull: { warehouses: id } });

            if (!warehouses&&warehouses1) {
                return res
                    .status(404)
                    .json({ message: `cannot find any warehouses` });
            }
            res.status(200).json("Delete warehouse successfully!");
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //List WAREHOUSE in user
    getAllWarehouseUser: async (req, res) => {
        try {
            const warehouse = await Warehouse.find();
            if (warehouse) {
                res.status(200).json({
                    message: "View warehouse data successfully",
                    warehouse: warehouse,
                });
            } else {
                res
                    .status(404)
                    .json({ message: "View warehouse data failed" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    //search
    searchWarehouse: async (req, res) => {
        try {
            // const result = await Owner.aggregate(
            //     [
            //         {
            //             $search: {
            //                 index: "search-text",
            //                 text: {
            //                     query: req.query.username,
            //                     path: {
            //                         wildcard: "*"
            //                     }
            //                 }
            //             },
            //         }
            //     ]
            // )
            const result = await Owner.findOne({
                $or: [
                    { username: req.query.username },
                    // {warehouse: req.query.warehouse},
                ]
            })
            console.log(result);
            if (result) {
                res.status(200).json({
                    message: "View warehouse data successfully",
                    warehouse: warehouse,
                });
            } else {
                res
                    .status(404)
                    .json({ message: "View warehouse data failed" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = WarehouseController;
