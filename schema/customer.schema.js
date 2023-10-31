const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
        // userId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required:true
        //     // ref: "user",
        //     // autopopulate: true,
        // },
        phoneNumber: {
            type: Number,
            required: true,
        },
        custId: {
            type: Number,
            required: true,
        },
        userId:{
            type:Number,
            required:false
        }
       
    },
    { strict: false, timestamps: true }
);
CustomerSchema.plugin(require("mongoose-autopopulate"));
const CustomerModel = mongoose.model("customer", CustomerSchema);
module.exports = CustomerModel;
