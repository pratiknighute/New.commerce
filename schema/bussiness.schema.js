const mongoose = require("mongoose");

const BussinessSchema = new mongoose.Schema(
    {
        groupId:{
            type:Number,
            require:false
        },
        categoryId:{
            type:Number,
            required:false
        },
        name:{
            type:String,
            required:false
        },
        tag:{
            type:String,
            required:false
        },
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: [Number]
        },
    },
    {strict:false, timestamps: true }
);

BussinessSchema.index({ location: "2dsphere" });
const BussinessModel = mongoose.model("bussiness", BussinessSchema);
module.exports = BussinessModel;
