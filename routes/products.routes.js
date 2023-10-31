const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/products.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/products.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const productcode = +Date.now();

        // Set the generated ID in the request body
        req.body.productcode = productcode;
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

router.get("/all/products", async (req, res) => {
    const serviceResponse = await service.preparePaginationAndReturnData(
        {
            // name: new RegExp(req.query.name, "i"),
        },
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/find/get-top-selling-products", async (req, res) => {
//     const serviceResponse = await service.getAllSponseredProduct(req.query);
//     console.log(serviceResponse);
//     // send response
//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/find/get-top-selling-products/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const serviceResponse = await service.getAllSponsoredProductsByGroupId(
        groupId,
        req.query
    );
    console.log(serviceResponse);
    // send response
    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/all/getByGroupId/:groupId", async (req, res) => {
//     const serviceResponse = await service.getAllDataByGroupId(
//         req.params.groupId,
//         req.query
//     );
//     requestResponsehelper.sendResponse(res, serviceResponse);
// });

router.get("/getByproductcode/:productcode", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getByProductCode(req.params.productcode);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/searchProductByPrice/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        name: req.query.name,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        slug: req.query.slug,
        productcode: req.query.productcode,
        categoryId: req.query.categoryId
    };

    if (criteria.minPrice || criteria.maxPrice) {
        const serviceResponse = await service.processProductSearch(
            groupId,
            criteria
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    } else {
        const serviceResponse = await service.processProductSearch(
            groupId,
            criteria
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
});

  
router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        name: req.query.name,
        slug: req.query.slug,
        productcode:req.query.productcode,
        categoryId: req.query.categoryId
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
module.exports = router;
