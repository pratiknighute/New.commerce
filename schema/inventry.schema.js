const mongoose = require("mongoose");

const InventrySchema = new mongoose.Schema(
    {
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "warehouse",
            autopopulate: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            autopopulate: true,
        },
        groupId: {
            type: Number,
            required: true,
        },
    },
    { strict: false, timestamps: true }
);
InventrySchema.plugin(require("mongoose-autopopulate"));
const InventryModel = mongoose.model("inventry", InventrySchema);
module.exports = InventryModel;
