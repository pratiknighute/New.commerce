const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/payments.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/payments.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }

        // Generate the auto ID
        const paymentId = +Date.now();

        // Set the generated ID in the request body
        req.body.paymentId = paymentId;

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
router.put("/updateByPaymentId/:paymentId", async (req, res) => {
    const serviceResponse = await service.updatePayment(
        req.params.paymentId,
        req.body
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.put("/updateByCustId/:custId", async (req, res) => {
    const serviceResponse = await service.updateCustId(
        req.params.custId,
        req.body
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getByShippingId/:paymentId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByPaymentId(req.params.paymentId);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        orderId: req.query.orderId,
        custId: req.query.custId
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/payments", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
