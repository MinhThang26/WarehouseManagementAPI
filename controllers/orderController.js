const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");
const Order = require("../models/Order");

const OrderController = {
    addOrder: async (req, res) => {
        try {
            //const idOwner = req.query.id_owner;
                const newOrder = new Order(req.body);
                const saveOrder = await newOrder.save();
            if (req.body.owner) {
                const owner = Owner.findById(req.body.owner);
                await owner.updateOne({ $push: { orders: saveOrder._id } });
            }
            if (req.body.user) {
                const user = User.findById(req.body.user);
                await user.updateOne({ $push: { orders: saveOrder._id } });
            }
            if (req.body.warehouses) {
                const warehouses = Warehouse.findById(req.body.warehouses);
                await warehouses.updateOne({ $push: { orders: saveOrder._id } });
            }
            res.status(200).json(saveOrder);
        }
         catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const idOwner = req.query.id_owner;

            if (idOwner) {
                const  {id}  = req.params;

                const order = await Order.findByIdAndDelete(id);
                const order1 = await User.updateMany({ $pull: { orders: id } });
                const order2 = await Owner.updateMany({ $pull: { orders: id } });
                const order3 = await Warehouse.updateMany({ $pull: { orders: id } });

                // await User.updateMany({orders: id},{$pull: {orders:id}})
                // await Owner.updateMany({orders: id},{$pull: {orders:id}})
                // await Warehouse.updateMany({orders: id},{$pull: {orders:id}})

                console.log(order);
                if (order&&order1&&order2&&order3) {
                    res.status(200).json("Delete order successfully!");
                }else {
                    res
                        .status(404)
                        .json({ message: `cannot find any order` });
                }
            } else {
                res.status(401).json({ message: "Xoa kho không thành công vì không phải là chủ kho" })
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    getAnOrder: async (req, res) => {
        try {
            const idUser = req.query.id_user;
            const order = await User.findById(idUser).populate("orders");
            res.status(200).json(order);
        } catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },
};
module.exports = OrderController;