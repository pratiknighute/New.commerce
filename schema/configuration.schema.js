const mongoose = require("mongoose");

const ConfigurationSchema = new mongoose.Schema(
    {
        groupId: {
            type: Number,
            required: true,
        },

    },
    {strict:false, timestamps: true }
);

const ConfigurationModel = mongoose.model("configuration", ConfigurationSchema);
module.exports = ConfigurationModel;
