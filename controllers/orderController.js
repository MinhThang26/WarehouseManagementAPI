const Owner = require("../models/Owner");
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");
const Order = require("../models/Order");

const OrderController = {
  addOrder: async (req, res) => {
    let data = null;
    let status = 500;
    try {
      const IDuser = req.user.id;
      const IDwarehouse = req.query.id_warehouse;
      const percentCapacity = req.body.capacity;
      const rentalTime = req.body.rentalTime;
      let capacity;
      let currentCapacity;
      let money;
      let percent;
      const user = await User.findById(IDuser);
      if (!user) {
        status = 403;
        data = {
          success: false,
          message:
            "You not a user so I don't have the right to rent the warehouse",
        };
      } else {
        if (!IDwarehouse) {
          status = 404;
          data = {
            success: false,
            message: "Missing ID warehouse",
          };
        } else {
          const warehouse = await Warehouse.findById(IDwarehouse);
          if (!warehouse) {
            status = 404;
            data = {
              success: false,
              message: "Warehouse not found",
            };
          } else {
            if (warehouse.currentCapacity == 0) {
              status = 400;
              data = {
                success: false,
                message: "Full warehouse capacity",
              };
            } else if (!rentalTime) {
              status = 400;
              data = {
                success: false,
                message: "Missing rentalTime",
              };
            } else if (!percentCapacity) {
              status = 400;
              data = {
                success: false,
                message: "Missing capacity",
              };
            } else {
              percent = (warehouse.currentCapacity / warehouse.capacity) * 100;
              console.log(percent);
              switch (percentCapacity) {
                case "25%":
                  capacity = warehouse.capacity * 0.25;
                  currentCapacity = warehouse.currentCapacity - capacity;
                  money = warehouse.monney * 0.25;
                  break;
                case "50%":
                  if (percent >= 50) {
                    capacity = warehouse.capacity * 0.5;
                    currentCapacity = warehouse.currentCapacity - capacity;
                    money = warehouse.monney * 0.5;
                    break;
                  } else {
                    res.status(400).json({
                      success: false,
                      message: "Not enough capacity",
                    });
                    return;
                  }

                case "75%":
                  if (percent >= 75) {
                    capacity = warehouse.capacity * 0.75;
                    currentCapacity = warehouse.currentCapacity - capacity;
                    money = warehouse.monney * 0.75;
                    break;
                  } else {
                    res.status(400).json({
                      success: false,
                      message: "Not enough capacity",
                    });
                    return;
                  }

                case "100%":
                  if (percent == 100) {
                    capacity = warehouse.capacity;
                    currentCapacity = warehouse.currentCapacity - capacity;
                    money = warehouse.monney;
                    break;
                  } else {
                    res.status(400).json({
                      success: false,
                      message: "Not enough capacity",
                    });
                    return;
                  }
                default:
                  res.status(400).json({
                    success: false,
                    message: "Capacity is not valid",
                  });
                  return;
              }
              const order = new Order({
                user: IDuser,
                owner: warehouse.owner,
                warehouse: IDwarehouse,
                rentalTime: rentalTime,
                capacity: capacity,
                money: money,
              });
              const savedOrder = await order.save();
              await Owner.updateOne(
                { _id: warehouse.owner },
                {
                  $push: {
                    orders: savedOrder._id,
                  },
                }
              );
              await user.updateOne({
                $push: {
                  orders: savedOrder._id,
                },
              });
              await warehouse.updateOne({
                $set: {
                  currentCapacity: currentCapacity,
                },
              });

              status = 200;
              data = {
                success: true,
                message: "Created order successfully",
                data: savedOrder,
              };
            }
          }
        }
      }
    } catch (error) {
      data = error;
      console.log(data);
    }
    res.status(status).json(data);
  },
  deleteOrderByUser: async (req, res) => {
    try {
      const idUser = req.user.id;
      const id = req.query.id_order;
      const order = await Order.findById(id);
      const warehouse = await Warehouse.findOne({ _id: order.warehouse });
      if (order.status == 0 || order.status == 1) {
        if (!id && !idUser) {
          res
            .status(404)
            .json({ message: "khong co khach hay don hang ton tai" });
        } else if (!order) {
          res.status(404).json({ message: "không tìm thấy kho hàng" });
        } else if (!idUser) {
          res.status(404).json({ message: "không tìm thấy id khach hang" });
        } else {
          const users = order.user;

          if (idUser != users) {
            res.status(401).json({ message: "Xoa kho không thành công" });
          } else {
            const order0 = await Order.findByIdAndDelete(id);
            const order1 = await User.updateMany({ $pull: { orders: id } });
            const order2 = await Owner.updateMany({ $pull: { orders: id } });
            const order3 = await Warehouse.updateMany({
              $pull: { orders: id },
            });

            // await User.updateMany({orders: id},{$pull: {orders:id}})
            // await Owner.updateMany({orders: id},{$pull: {orders:id}})
            // await Warehouse.updateMany({orders: id},{$pull: {orders:id}})
            if (order0 && order1 && order2 && order3) {
              await warehouse.updateOne({
                $set: {
                  currentCapacity: warehouse.currentCapacity + order.capacity,
                },
              });
              res.status(200).json("Delete order successfully!");
            } else {
              res.status(404).json({ message: `cannot find any order` });
            }
          }
        }
      } else if (order.status == 2) {
        await order.updateOne({ $set: { status: 3 } });

        await warehouse.updateOne({
          $set: { currentCapacity: warehouse.currentCapacity + order.capacity },
        });
        res.status(200).json("Delete order successfully!");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteOrderByOwner: async (req, res) => {
    try {
      const idOwner = req.user.id;
      const id = req.query.id_order;
      const order = await Order.findById(id);
      const warehouse = await Warehouse.findOne({ _id: order.warehouse });
      if (order.status == 0 || order.status == 1) {
        if (!id && !idOwner) {
          res
            .status(404)
            .json({ message: "khong co chu kho hay don hang ton tai" });
        } else if (!order) {
          res.status(404).json({ message: "không tìm thấy kho hàng" });
        } else if (!idOwner) {
          res.status(404).json({ message: "không tìm thấy id chu kho" });
        } else {
          const owner = order.owner;
          if (idOwner != owner) {
            res.status(401).json({ message: "Xoa kho không thành công" });
          } else {
            const order0 = await Order.findByIdAndDelete(id);
            const order1 = await User.updateMany({ $pull: { orders: id } });
            const order2 = await Owner.updateMany({ $pull: { orders: id } });
            const order3 = await Warehouse.updateMany({
              $pull: { orders: id },
            });

            // await User.updateMany({orders: id},{$pull: {orders:id}})
            // await Owner.updateMany({orders: id},{$pull: {orders:id}})
            // await Warehouse.updateMany({orders: id},{$pull: {orders:id}})
            if (order0 && order1 && order2 && order3) {
              await warehouse.updateOne({
                $set: {
                  currentCapacity: warehouse.currentCapacity + order.capacity,
                },
              });
              res.status(200).json("Delete order successfully!");
            } else {
              res.status(404).json({ message: `cannot find any order` });
            }
          }
        }
      } else if (order.status == 2) {
        await order.updateOne({ $set: { status: 3 } });

        await warehouse.updateOne({
          $set: { currentCapacity: warehouse.currentCapacity + order.capacity },
        });
        res.status(200).json("Delete order successfully!");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getOrderForOwner: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idAccount = req.user.id;
      let orderStatus = req.query.status;
      if (!orderStatus) {
        orderStatus = 0;
      }
      const orders = await Order.find({ owner: idAccount, status: orderStatus })
        .populate("owner")
        .populate("user")
        .populate("warehouse");
      if (!orders) {
        status = 400;
        data = {
          success: false,
          message: "Your warehouses are not rented yet",
        };
      } else {
        status = 200;
        data = {
          success: true,
          message:
            "List order status " + orderStatus + " by owner successfully ",
          data: orders,
        };
      }
    } catch (error) {
      data = error;
      console.log(data);
    }
    res.status(status).json(data);
  },
  getOrderForUser: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const idAccount = req.user.id;
      let orderStatus = req.query.status;
      if (!orderStatus) {
        orderStatus = 0;
      }
      const orders = await Order.find({ user: idAccount, status: orderStatus })
        .populate("owner")
        .populate("user")
        .populate("warehouse");
      if (!orders) {
        status = 400;
        data = {
          success: false,
          message: "Your warehouses are not rented yet",
        };
      } else {
        status = 200;
        data = {
          success: true,
          message:
            "List order status " + orderStatus + " by user successfully ",
          data: orders,
        };
      }
    } catch (error) {
      data = error;
      console.log(data);
    }
    res.status(status).json(data);
  },
  getAOrder: async (req, res) => {
    try {
      const order = await Order.findOne({
        $or: [{ _id: req.query.id }],
      })
        .populate("user")
        .populate("owner")
        .populate("warehouse");
      console.log(order);
      if (order) {
        res.status(200).json({
          message: "View order data successfully",
          Order: order,
        });
      } else {
        res.status(404).json({ message: "View order data failed" });
      }
    } catch {
      res.status(500).json({ message: error.message });
    }
  },
  searchOrder: async (req, res) => {
    let searchOptions = {};
    if (req.query.name != null && req.query.name !== "") {
      searchOptions.name = new RegExp(req.query.name, "i");
    }
    try {
      const result = await Order.find(searchOptions)
        .populate("owner")
        .populate("user")
        .populate("warehouse");
      console.log(result);
      if (result) {
        res.status(200).json({
          message: "View Order data successfully",
          Order: result,
        });
      } else {
        res.status(404).json({ message: "View Order data failed" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  activateOrder: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const id_owner = req.user.id;
      const id_order = req.query.id_order;
      if (!id_order) {
        status = 404;
        data = {
          success: false,
          message: "Missing ID Order",
        };
      } else {
        const order = await Order.findById(id_order);
        if (!order) {
          status = 404;
          data = {
            success: false,
            message: "Order not found",
          };
        } else {
          if (!id_owner == order.owner) {
            status = 404;
            data = {
              success: false,
              message: "You do not have permission to activate this order",
            };
          } else {
            await order.updateOne({
              $set: {
                status: 1,
              },
            });
            status = 200;
            data = {
              success: true,
              message: "Activate order successfully",
            };
          }
        }
      }
    } catch (error) {
      console.log(error);
      data = error;
    }
    res.status(status).json(data);
  },
  paymentOrder: async (req, res) => {
    let status = 500;
    let data = null;
    try {
      const id_owner = req.user.id;
      const id_order = req.query.id_order;
      if (!id_order) {
        status = 404;
        data = {
          success: false,
          message: "Missing ID Order",
        };
      } else {
        const order = await Order.findById(id_order);
        if (!order) {
          status = 404;
          data = {
            success: false,
            message: "Order not found",
          };
        } else {
          if (!id_owner == order.owner) {
            status = 404;
            data = {
              success: false,
              message:
                "You do not have permission to confirm payment this order",
            };
          } else {
            await order.updateOne({
              $set: {
                status: 2,
              },
            });
            status = 200;
            data = {
              success: true,
              message: "Confirm payment order successfully",
            };
          }
        }
      }
    } catch (error) {
      console.log(error);
      data = error;
    }
    res.status(status).json(data);
  },
};
module.exports = OrderController;
