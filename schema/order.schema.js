const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
        customer:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"customer",
            autopopulate:true,
            required:false,
        },
        products:{
            type:Array,
            default:true
        },
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cart",
            autopopulate: true,
        },
        shippingId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"shipping",
            autopopulate: true,
        },
        paid:{
            type:Boolean,
            required:false,
            default:false
        },
        expectedDeliveryDate:{
            type:Date,
            required:false
        },
        orderId:{
            type:Number,
            required:false
        },
        status:{
            type:String,
            enum:["new","in-progress","dispatched","intransite","delivered","completed","canceled","return"],
            default:"new",
        }
    },
    { strict: false, timestamps: true }
);
OrderSchema.plugin(require("mongoose-autopopulate"))
const OrderModel = mongoose.model("order", OrderSchema);
module.exports = OrderModel;
