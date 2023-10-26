const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const WarehouseCategory = require("../models/WarehouseCategory");

const WarehouseController ={
    //ADD WAREHOUSE
    addWarehouse: async(req,res)=>{
        try {
            const newWarehouse = new Warehouse(req.body);
            const saveWarehouse = await newWarehouse.save();
            if(req.body.owner){
                const owner = Owner.findById(req.body.owner);
                await owner.updateOne({ $push: {warehouses: saveWarehouse._id } });
            }
            if(req.body.category){
                const category = WarehouseCategory.findById(req.body.category);
                await category.updateOne({ $push: {warehouses: saveWarehouse._id } });
            }
            res.status(200).json(saveWarehouse);
        } catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },
    getAllWarehouses: async(req,res)=>{
        try {
            const warehouses = await Warehouse.find();
            if (warehouses) {
                        res.status(200).json({
                          message: "View warehouse data successfully",
                          warehouses: warehouses,
                        });
                      } else {
                        res
                          .status(404)
                          .json({ message: "View warehouse data failed" });
                      }
        } catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    }

    // getAllWarehouse: async (req, res) => {
    //     try {
    //       const warehouse = await Warehouse.find();
    //       if (warehouse) {
    //         res.status(200).json({
    //           message: "View warehouse data successfully",
    //           warehouse: warehouse,
    //         });
    //       } else {
    //         res
    //           .status(404)
    //           .json({ message: "View warehouse data failed" });
    //       }
    //     } catch (error) {
    //       res.status(500).json(error);
    //     }
    //   },
};

module.exports = WarehouseController;
