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
            res.status(200).json(saveOrder);
        }
         catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const { id } = req.params;
            const order = await Order.findByIdAndDelete(id);
            if (!order) {
                return res
                    .status(404)
                    .json({ message: `cannot find any order` });
            }
            res.status(200).json("Delete order successfully!");
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