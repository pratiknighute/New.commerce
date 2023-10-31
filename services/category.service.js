const { default: mongoose } = require("mongoose");
const CategoryModel = require("../schema/category.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class CategoryService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    async getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        if (criteria.userId) query.userId = criteria.userId;

        if (criteria.categoryId) query.categoryId = criteria.categoryId;



        return this.preparePaginationAndReturnData(query, criteria);
    }

    async saveProductInCart(details) {
        return this.execute(async () => {
            let createCategories = await this.model.findOne({
                groupId: details.groupId,
                userId: new mongoose.Types.ObjectId(details.userId),
            });
            if (!createCategories) {
                createCategories = await this.model.create({
                    groupId: details.groupId,
                    userId: new mongoose.Types.ObjectId(details.userId),
                    category: details.category,
                });
            } else {
                // Convert product IDs to ObjectIds
                const categoriesIds = details.category.map(
                    (categoryId) => new mongoose.Types.ObjectId(categoryId)
                );

                // Filter out duplicate product IDs before concatenating
                const uniqueCategoryIds = categoriesIds.filter(
                    (categoryId) => !createCategories.category.includes(categoryId)
                );

                createCategories.category =
                createCategories.category.concat(uniqueCategoryIds);
                await createCategories.save();
            }
            let category = await this.model.findOneAndUpdate(
                {
                    groupId: details.groupId,
                    userId: new mongoose.Types.ObjectId(details.userId),
                },
                {
                    $addToSet: {
                        category: {
                            $each: details.category.map(
                                (categoryId) =>
                                    new mongoose.Types.ObjectId(categoryId)
                            ),
                        },
                    },
                },
                { new: true }
            );

            return category;
        });
    }

    async getDataByCategoryId(categoryId){
        let categoryData=await CategoryModel.findOne({categoryId:categoryId})
        return categoryData
    }
}

module.exports = new CategoryService(CategoryModel, "category");
