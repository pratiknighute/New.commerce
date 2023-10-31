const mongoose = require("mongoose");

const ServicerequestSchema = new mongoose.Schema(
    {
        phoneNumber: {
            type: Number,
            required: true,
        },
        categoryId: {
            type: Number
        },
        subcategoryId: {
            type: Number
        },
        servicerequestId: {
            type: Number
        },
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number]
        },
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: Number,
            required: false,
        },
        groupId: {
            type: Number
        },
        status: {
            type: String,
            enum: ["new", "in-progress", "dispatched", "intransite", "delivered", "completed", "canceled", "return"],
            default: "new",
        }
    },
    { strict: false, timestamps: true }
);
ServicerequestSchema.plugin(require("mongoose-autopopulate"));
const ServicerequestModel = mongoose.model(
    "servicerequest",
    ServicerequestSchema
);
module.exports = ServicerequestModel;
