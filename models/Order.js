const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        money: {
            type: Number,
            required: true,
            
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
        warehouses: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Warehouse",
        },
        rentalTime:{
            type: String,
            require: true,
        },

        isActive: {
            type: Boolean,
            default: true,
          },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
