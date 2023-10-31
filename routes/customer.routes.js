const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/customer.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");
const axios = require("axios");
const { default: mongoose } = require("mongoose");
const CustomerModel = require("../schema/customer.schema");

router.post("/", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const custId = +Date.now();

    req.body.custId = custId;

    if (!req.body.addresses || req.body.addresses.length === 0) {
        req.body.addresses = [];
    } else {
        const addressId = +Date.now();
        const newAddress = {
            _id: new mongoose.Types.ObjectId(),
            addressId: addressId,
            address: req.body.addresses[0],
        };
        req.body.addresses = [newAddress];
    }

    const serviceResponse = await service.create(req.body);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/getByCustomerByUserId/:userId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByUserId(req.params.userId);
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.delete("/DeleteAddress/:custId/:addressId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.deleteAddressByCustId(
        req.params.custId,
        req.params.addressId
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/updateByCustId/:custId", async (req, res) => {
    if (!req.body.addresses || req.body.addresses.length === 0) {
        // If no addresses are provided, assign an empty array to req.body.addresses
        req.body.addresses = [];
    } else {
        // Generate MongoDB ObjectId for each address if it doesn't have an _id already
        req.body.addresses = req.body.addresses.map((address) => {
            if (!address._id) {
                return {
                    _id: new mongoose.Types.ObjectId(),
                    address,
                };
            }
            return address;
        });
    }
    const serviceResponse = await service.updateCustomer(
        req.params.custId,
        req.body
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/updateByUserId/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const data = {};
        const newAddress = req.body.addresses && req.body.addresses.length > 0
            ? {
                _id: new mongoose.Types.ObjectId(),
                addressId: +Date.now(),
                address: { ...req.body.addresses[0] }
            }
            : null;

        for (const key in req.body) {
            if (key !== 'addresses') {
                data[key] = req.body[key];
            }
        }

        const serviceResponse = await service.updateCustomerByUserId(userId, newAddress, data);

        if (serviceResponse.isError) {
            return res.status(500).json({ error: serviceResponse.message });
        }

        return res.json({ data: serviceResponse.data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/group", async (req, res) => {
    const serviceResponse = await service.getAllRequestsByCriteria({
        groupId: req.query.groupId,

        phoneNumber: req.query.phoneNumber,
    });

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/getBycustId/:custId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByCustId(req.params.custId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        name: req.query.name,
        phoneNumber: req.query.phoneNumber,
        userId: req.query.userId,
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/updateAddress/:groupId/:addressId", async (req, res) => {
    const groupId = req.params.groupId;
    const addressId = req.params.addressId;

    if (!req.body.address) {
        console.log("New address data is missing in the request body.");
        return res.status(400).json({ message: "New address data is missing in the request body." });
    }

    try {
        const customer = await CustomerModel.findOne({ groupId: groupId });

        console.log("customer", customer);

        const addressIndex = customer.addresses.findIndex((address) => address.addressId == addressId);

        console.log("addressIndex", addressIndex);

        if (addressIndex === -1) {
            console.log("Address not found.");
            return res.status(404).json({ message: "Address not found." });
        }

        customer.addresses[addressIndex].address = req.body.address;

        const updatedCustomer = await CustomerModel.findOneAndUpdate(
            { groupId: groupId },
            { $set: { addresses: customer.addresses } },
            { new: true }
        );

        if (!updatedCustomer) {
            console.log("Failed to update customer.");
            return res.status(500).json({ message: "Failed to update customer." });
        }

        console.log("Address updated successfully.");
        return res.status(200).json({
            status: "Success",
            data: updatedCustomer,
            message: "Address updated successfully",
        });
    } catch (error) {
        console.error("An error occurred while updating the address:", error);
        return res.status(500).json({ message: "An error occurred while updating the address." });
    }
});



module.exports = router;
