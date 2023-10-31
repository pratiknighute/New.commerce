const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        groupId: {
            type: Number,
            required: true,
        },

        products: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: "products",
                    autopopulate: true,
                },
                quantity: {
                    type: Number,
                   default: 1,
            },
        }
        ],

        // products: [
        //     {
        //         productId: {
        //             type: mongoose.Schema.Types.ObjectId,
        //             ref: "products",

        //         },
        //         quantity: {
        //             type: Number,
        //             required: true,
        //         },
        //     },
        // ],
    },
    { strict: false, timestamps: true }
);
CartSchema.plugin(require("mongoose-autopopulate"));
const CartModel = mongoose.model("cart", CartSchema);
module.exports = CartModel;
