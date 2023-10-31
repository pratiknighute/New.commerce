const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/services.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/services.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const subcategoryId = +Date.now();
        req.body.subcategoryId = subcategoryId;
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

router.get("/getByServiceId/:groupId/:subcategoryId", async (req, res) => {
    const serviceResponse = await service.getByGroupId(
        req.params.groupId,
        req.params.subcategoryId
    );

    requestResponsehelper.sendResponse(res, {
        ...serviceResponse,
        data: serviceResponse.data.data,
    });
});

router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        name: req.query.name,
        categoryId: req.query.categoryId,
        subcategoryId: req.query.subcategoryId,
        parentServiceId: req.query.parentServiceId,
        tags: req.query.tags,
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/search/:groupId", async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const search = req.query.search;

        const serviceResponse = await service.searchByTagsAndName(groupId, lat, lon, search);

        requestResponsehelper.sendResponse(res, serviceResponse);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
