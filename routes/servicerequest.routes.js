const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/servicerequest.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/servicerequest.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const servicerequestId = +Date.now();
        req.body.servicerequestId = servicerequestId;
        const DateTime = new Date();
        req.body.DateTime = DateTime.toLocaleString();
        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/group/:groupId", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { name, phoneNumber, userId, servicerequestId } = req.query;
        const serviceResponse = await service.getAllData(name, phoneNumber, userId, groupId, servicerequestId);

        if (!serviceResponse.data || serviceResponse.data.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }

        requestResponsehelper.sendResponse(res, serviceResponse);
    } catch (error) {
        requestResponsehelper.sendResponse(res, 500, error.message);
    }
});

router.post("/count", async (req, res) => {
    try {
        const { groupId, startDate, endDate } = req.body;

        const serviceResponse = await service.countServiceRequestByGroupAndDate(groupId, startDate, endDate);

        if (!serviceResponse || Object.keys(serviceResponse.data.items).length === 0) {
            return res.status(404).json({ message: "No service requests found within the specified date range for the given GroupId." });
        }

        requestResponsehelper.sendResponse(res, serviceResponse);
    } catch (error) {
        requestResponsehelper.sendResponse(res, 500, error.message);
    }
});



module.exports = router;
