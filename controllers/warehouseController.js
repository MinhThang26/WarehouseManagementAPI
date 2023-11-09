const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const WarehouseCategory = require("../models/WarehouseCategory");

const WarehouseController = {
    //ADD WAREHOUSE
    addWarehouse: async (req, res) => {
        try {
            const idOwner = req.query.id_owner;
            if (idOwner) {
                const newWarehouse = new Warehouse({
                    wareHouseName: req.body.wareHouseName,
                    address: req.body.address,
                    category: req.body.category,
                    monney: req.body.monney,
                    owner: idOwner
                });
                if(!req.body.wareHouseName){
                    res.status(401).json({message: "Không được bỏ trống tên kho hàng "});
                }
                else if(!req.body.address){
                    res.status(401).json({message: "Không được bỏ trống địa chỉ kho hàng "});
                }
                else if(!req.body.category){
                    res.status(401).json({message: "Không được bỏ trống danh mục kho"});
                }
                else if (!req.body.monney) {
                    res.status(401).json({message: "Không được bỏ trống giá tiền kho hàng "});
                }
                else if(!idOwner){
                    res.status(401).json({message: "Không phải chủ kho"});
                }
                else
                {
                const saveWarehouse = await newWarehouse.save();
                res.status(200).json(saveWarehouse);
                
                if (idOwner) {
                    const owner = Owner.findById(idOwner);
                    await owner.updateOne({ $push: { warehouses: saveWarehouse._id } });
                }
                if (req.body.category) {
                    const category = WarehouseCategory.findById(req.body.category);
                    await category.updateOne({ $push: { warehouses: saveWarehouse._id } });
                }   
                }
            }
            else 
            {
                res.status(404).json({ message: "thêm không thành công do không phải là chủ kho" });
            }
        }
        catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },

    // getAnWarehouses: async (req, res) => {
    //     try {
    //         const idOwner = req.query.id_owner;
    //         const owner = await Owner.findById(idOwner).populate("warehouses");
    //         res.status(200).json(owner);
    //     } catch (err) {
    //         res.status(500).json(err); //HTTP Request code
    //     }
    // },

    getAnWarehouses: async (req, res) => {
        try {
            const idOwner = req.query.id_owner;
            if (!idOwner) {
                res.status(401).json({ message: "xem danh sách kho không thành công vì không phải là chủ kho" })
            }
            else {
                const owner = await Owner.findById(idOwner).populate("warehouses");
                const warehouse = owner.warehouses;
                console.log(warehouse);

                if(!warehouse){
                    res.status(401).json({ message: "khong co kho hang"});
                }
                else {
                    res.status(200).json(warehouse);
                }
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
            const idOwner = req.query.id_owner;
            if (idOwner) {
                const { id } = req.params;
                const warehouses = await Warehouse.findByIdAndDelete(id);
                const warehouses1 = await Owner.updateOne({ $pull: { warehouses: id } });
                if (warehouses && warehouses1) {
                    res.status(200).json({ message: "Delete warehouse successfully!" });
                } else {
                    res.status(404).json({ message: `cannot find any warehouses` });
                }
            }
            else {
                res.status(401).json({ message: "Xoa kho không thành công vì không phải là chủ kho" })
            }

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
    },

    //get a warehouse
    getAWarehouse: async (req, res) => {
        try {
            const warehouse = await Warehouse.findOne({
                $or: [
                    { _id: req.query.id }
                ]
            })
            console.log(warehouse);
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
        } catch {
            res.status(500).json({ message: error.message });
        }
    }

};

module.exports = WarehouseController;
