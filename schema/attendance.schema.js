const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
 
    },
    {strict:false, timestamps: true }
);

const AttendanceModel = mongoose.model("attendance", AttendanceSchema);
module.exports = AttendanceModel;
