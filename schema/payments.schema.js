const mongoose = require("mongoose");

const PaymentsSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,

            required: true,
        },
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"products",
            autopopulate:true
        },
        custId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"customer",
            autopopulate:true,
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
            autopopulate: true,
        },
        paymentId:{
            type:Number,
            required:false,
        },
       paymentMode:{
        type:Boolean,
        required:false
       } 
    },
    {strict:false, timestamps: true }
);
PaymentsSchema.plugin(require("mongoose-autopopulate"))
const PaymentsModel = mongoose.model("payments", PaymentsSchema);
module.exports = PaymentsModel;
