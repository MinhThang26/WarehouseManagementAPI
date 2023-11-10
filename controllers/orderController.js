const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");
const Order = require("../models/Order");

const OrderController = {

    addOrder: async (req, res) => {
        try {
            const idUser = req.query.id_user;
            if (idUser) {
                const newOrder = new Order({
                    money: req.body.money,
                    owner: req.body.owner,
                    user: idUser,
                    warehouses: req.body.warehouses,
                    rentalTime: req.body.rentalTime
                });
                if (!req.body.money) {
                    res.status(401).json({ message: "Không được bỏ trống giá tiền kho hàng" });
                }
                else if (!req.body.owner) {
                    res.status(401).json({ message: "Thiếu id chủ kho" });
                }
                else if (!req.body.warehouses) {
                    res.status(401).json({ message: "Thiếu id kho hàng" });
                }
                else if (!req.body.rentalTime) {
                    res.status(401).json({ message: "Không được bỏ trống thời gian thuê kho hàng " });
                }
                else if (!idUser) {
                    res.status(401).json({ message: "Thiếu id khách hàng" });
                }
                else {

                    const saveOrder = await newOrder.save();

                    if (req.body.owner) {
                        const owner = Owner.findById(req.body.owner);
                        await owner.updateOne({ $push: { orders: saveOrder._id } });
                    }
                    if (idUser) {
                        const user = User.findById(idUser);
                        await user.updateOne({ $push: { orders: saveOrder._id } });
                    }
                    if (req.body.warehouses) {
                        const warehouses = Warehouse.findById(req.body.warehouses);
                        await warehouses.updateOne({ $push: { orders: saveOrder._id } });
                    }
                    res.status(200).json(saveOrder);
                }
            }
            else {
                res.status(404).json({ message: "Thêm không thành công vì chưa đăng nhập " });
            }
        }
        catch (err) {
            res.status(500).json(err); //HTTP Request code
        }
    },


    deleteOrderByUser: async (req, res) => {
        try 
        {
            const idUser = req.query.id_user;
            const id = req.query.id_order;
            const order = await Order.findById(id);
            if (!id && !idUser) {
                res.status(404).json({ message: "khong co khach hay don hang ton tai" });
            }
            else if (!order) {
                res.status(404).json({ message: "không tìm thấy kho hàng" });
            }
            else if (!idUser) {
                res.status(404).json({ message: "không tìm thấy id khach hang" });
            }
            else 
            {
                const users = order.user;

                if (idUser != users) 
                {
                    res.status(401).json({ message: "Xoa kho không thành công" })
                }
                else 
                {

                    const order = await Order.findByIdAndDelete(id);
                    const order1 = await User.updateMany({ $pull: { orders: id } });
                    const order2 = await Owner.updateMany({ $pull: { orders: id } });
                    const order3 = await Warehouse.updateMany({ $pull: { orders: id } });

                    // await User.updateMany({orders: id},{$pull: {orders:id}})
                    // await Owner.updateMany({orders: id},{$pull: {orders:id}})
                    // await Warehouse.updateMany({orders: id},{$pull: {orders:id}})
                    if (order && order1 && order2 && order3) {
                        res.status(200).json("Delete order successfully!");
                    } else {
                        res
                            .status(404)
                            .json({ message: `cannot find any order` });
                    }
                }
            } 
        }
        catch (error) {
                res.status(500).json({ message: error.message });
            }
        },

        deleteOrderByOwner: async (req, res) => {
            try 
            {
                const idOwner = req.query.id_owner;
                const id = req.query.id_order;
                const order = await Order.findById(id);
                if (!id && !idOwner) {
                    res.status(404).json({ message: "khong co chu kho hay don hang ton tai" });
                }
                else if (!order) {
                    res.status(404).json({ message: "không tìm thấy kho hàng" });
                }
                else if (!idOwner) {
                    res.status(404).json({ message: "không tìm thấy id chu kho" });
                }
                else 
                {
                    const owner = order.owner;
                    if (idOwner != owner) 
                    {
                        res.status(401).json({ message: "Xoa kho không thành công" })
                    }
                    else 
                    {
                        const order = await Order.findByIdAndDelete(id);
                        const order1 = await User.updateMany({ $pull: { orders: id } });
                        const order2 = await Owner.updateMany({ $pull: { orders: id } });
                        const order3 = await Warehouse.updateMany({ $pull: { orders: id } });
    
                        // await User.updateMany({orders: id},{$pull: {orders:id}})
                        // await Owner.updateMany({orders: id},{$pull: {orders:id}})
                        // await Warehouse.updateMany({orders: id},{$pull: {orders:id}})
                        if (order && order1 && order2 && order3) {
                            res.status(200).json("Delete order successfully!");
                        } else {
                            res
                                .status(404)
                                .json({ message: `cannot find any order` });
                        }
                    }
                } 
            }
            catch (error) {
                    res.status(500).json({ message: error.message });
                }
            },
            getOrderForOwner: async (req, res) => {
                try {
                    const idOwner = req.query.id_owner;
                    if (!idOwner) {
                        res.status(401).json({ message: "xem danh sách đơn hàng không thành công vì không phải là chủ kho" })
                    }
                    else {
                        const owner = await Owner.findById(idOwner).populate("orders");
                        const order = owner.orders;
                        console.log(order);
        
                        if(!order){
                            res.status(401).json({ message: "khong co don hang"});
                        }
                        else {
                            res.status(200).json(order);
                        }
                    }
                } catch (err) {
                    res.status(500).json(err); //HTTP Request code
                }
            },
            getOrderForUser: async (req, res) => {
                try {
                    const idUser = req.query.id_user;
                    if (!idUser) {
                        res.status(401).json({ message: "xem danh sách đơn hàng không thành công vì không phải là khách hàng" })
                    }
                    else {
                        const user = await User.findById(idUser).populate("orders");
                        const order = user.orders;
                        console.log(order);
                        if(!order){
                            res.status(401).json({ message: "khong co don hang"});
                        }
                        else {
                            res.status(200).json(order);
                        }
                    }
                } catch (err) {
                    res.status(500).json(err); //HTTP Request code
                }
            },
            getAOrder: async (req, res) => {
                try {
                    const order = await Order.findOne({
                        $or: [
                            { _id: req.query.id }
                        ]
                    })
                    console.log(order);
                    if (order) {
                        res.status(200).json({
                            message: "View order data successfully",
                            Order: order,
                        });
                    } else {
                        res
                            .status(404)
                            .json({ message: "View order data failed" });
                    }
                } catch {
                    res.status(500).json({ message: error.message });
                }
            }
    };
    module.exports = OrderController;