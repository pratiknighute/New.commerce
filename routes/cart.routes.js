const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/cart.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/cart.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const cartId = +Date.now();

        // Set the generated ID in the request body
        req.body.cartId = cartId;
        const serviceResponse = await service.saveProductInCart(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

router.put("/:cartId/products/:productId", async (req, res, next) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;
        const updatedData = req.body;

        const updatedCart = await service.updateProductInCart(
            cartId,
            productId,
            updatedData
        );

        if (updatedCart) {
            return res.json({
                status: "Success",
                data: updatedCart,
            });
        } else {
            return res.status(404).json({
                status: "Error",
                message: "Cart or product not found",
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Internal Server Error",
        });
    }
});

router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.delete("/product/:cartId/:productId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.deleteProductByCart(
        req.params.cartId,
        req.params.productId
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.put("/:id", async (req, res) => {
    const serviceResponse = await service.updateById(req.params.id, req.body);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/getCartDetailsByCartId/:cartId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }

    const committeeId = req.params.cartId;
    const name = req.query.name; // Get the name from the query parameter

    const serviceResponse = await service.getAllProductsByCartId(
        committeeId,
        name
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/getProductByUserId/:groupId/:userId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }   
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    const name = req.query.name; // Get the name from the query parameter

    const serviceResponse = await service.getProductByUserId(
        groupId,
        userId,
        name
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/product/:productId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.getProductById(
        req.params.productId,
        req.query
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});
// router.get("/:groupId/:userId", async (req, res) => {
//     const serviceResponse = await service.getProductByUserId(
//         req.params.groupId,
//         req.params.userId
//     );

//     requestResponsehelper.sendResponse(res, serviceResponse);
// });
router.get("/:id", async (req, res) => {
    const serviceResponse = await service.getById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const serviceResponse = await service.getAllDataByGroupId(
        req.params.groupId,
        req.query
    );

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.get("/all/getByGroupId/:groupId", async (req, res) => {
    const groupId = req.params.groupId;
    const criteria = {
        name: req.query.name,
        code: req.query.code,
        userId: req.query.userId,
    };

    const serviceResponse = await service.getAllDataByGroupId(
        groupId,
        criteria
    );
    requestResponsehelper.sendResponse(res, serviceResponse);
});

module.exports = router;
