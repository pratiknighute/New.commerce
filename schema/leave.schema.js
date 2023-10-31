const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },
    },
    { strict: false, timestamps: true }
);

const LeaveModel = mongoose.model("leave", LeaveSchema);
module.exports = LeaveModel;
