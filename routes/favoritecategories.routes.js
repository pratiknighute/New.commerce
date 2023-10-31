const express = require("express");
const router = express.Router();
const { checkSchema } = require("express-validator");
const service = require("../services/favoritecategories.service");
const requestResponsehelper = require("@baapcompany/core-api/helpers/requestResponse.helper");
const ValidationHelper = require("@baapcompany/core-api/helpers/validation.helper");

router.post(
    "/",
    checkSchema(require("../dto/favoritecategories.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const serviceResponse = await service.create(req.body);
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.post(
    "/saveFavoriteCategories",
    checkSchema(require("../dto/category.dto")),
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const categoriesId = +Date.now();

        // Set the generated ID in the request body
        req.body.categoriesId = categoriesId;
        const serviceResponse = await service.saveFavCategoryInCategory(
            req.body
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);
router.delete("/:id", async (req, res) => {
    const serviceResponse = await service.deleteById(req.params.id);

    requestResponsehelper.sendResponse(res, serviceResponse);
});
router.delete("/category/:favoriteCategoryId/:categoryId", async (req, res, next) => {
    if (ValidationHelper.requestValidationErrors(req, res)) {
        return;
    }
    const serviceResponse = await service.deleteProductByCart(
        req.params.favoriteCategoryId,
        req.params.categoryId,
     
    );
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

router.get("/all/favoriteCategories", async (req, res) => {
    const serviceResponse = await service.getAllByCriteria({});

    requestResponsehelper.sendResponse(res, serviceResponse);
});

router.get(
    "/getCategoriesByUserId/:groupId/:userId",
    async (req, res, next) => {
        if (ValidationHelper.requestValidationErrors(req, res)) {
            return;
        }
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        const name = req.query.name; // Get the name from the query parameter
        const serviceResponse = await service.getCategoriesByUserId(
            groupId,
            userId,
            name
        );
        requestResponsehelper.sendResponse(res, serviceResponse);
    }
);

module.exports = router;
