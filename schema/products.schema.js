const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        groupId: {
            type: Number,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            autopopulate: true,
        },
        subCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
            autopopulate: true,
        },
       
    },
    { strict: false, timestamps: false }
);

productsSchema.plugin(require("mongoose-autopopulate"));

const ProductsModel = mongoose.model("products", productsSchema);

module.exports = ProductsModel;
