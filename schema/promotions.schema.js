const mongoose = require("mongoose");

const PromotionsSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
    },
    { strict: false, timestamps: true }
);

const PromotionsModel = mongoose.model("promotions", PromotionsSchema);
module.exports = PromotionsModel;
