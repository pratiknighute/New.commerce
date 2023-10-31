const mongoose = require("mongoose");

const FavoriteCategoriesSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        groupId: {
            type: Number,
            required: true,
        },
        category: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "category",
                required: false,
            },
        ],
    },
    { strict: false, timestamps: true }
);

const FavoriteCategoriesModel = mongoose.model(
    "favoritecategories",
    FavoriteCategoriesSchema
);
module.exports = FavoriteCategoriesModel;
