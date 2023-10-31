const { default: mongoose } = require("mongoose");
const FavoriteCategoriesModel = require("../schema/favoritecategories.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class FavoriteCategoriesService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    async saveFavCategoryInCategory(details) {
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
    async getCategoriesByUserId(groupId, userId,name) {
            const query = { userId: userId, groupId: groupId };
            const populateOptions = {
                path: "category",
                match: name ? { name: { $regex: name, $options: "i" } } : {},
            };   
            const category = await this.model
                .findOne(query)
                .populate(populateOptions)
                .lean();
            if (category && category.category && name) {
                category.category = category.category.filter((category) =>
                category.name.toLowerCase().includes(name.toLowerCase())
                );
            }
    
            const response = {
                data: category,
            };
    
            return response;
        }
        async deleteProductByCart(favoriteCategoryId, categoryId) {
            return this.updateById(favoriteCategoryId, {
                $pull: { category: categoryId },
            });
        }
}

module.exports = new FavoriteCategoriesService(FavoriteCategoriesModel, 'favoritecategories');
