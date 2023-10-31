const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
        empId: {
            type: Number,
            required: true,
        },
        RFID:{
            type:String,
            required:false
        }
    },
    { strict: false, timestamps: true }
);

const EmployeeModel = mongoose.model("employee", EmployeeSchema);
module.exports = EmployeeModel;
