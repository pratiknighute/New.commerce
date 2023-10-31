const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: false,
        },
        groupId: {
            type: Number,
            required: true,
        },
        // addresses: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     defaultValue: [],
        // },
        categoryId: {
            type: Number,
            required: false,
        },
    },
    { strict: false, timestamps: true }
);

CategorySchema.plugin(require("mongoose-autopopulate"));
const CategoryModel = mongoose.model("category", CategorySchema);
module.exports = CategoryModel;
