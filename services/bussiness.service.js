const BussinessModel = require("../schema/bussiness.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class BussinessService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");
        if (criteria.categoryId) query.categoryId = criteria.categoryId;
        if (criteria.tags) query.tags = new RegExp(criteria.tags, "i");
        // if (criteria.subcategory) query.subcategory = criteria.subcategory;

        return this.preparePaginationAndReturnData(query, criteria);
    }

    async searchByTagsAndName(groupId, lat, lon, search) {
        try {
            const searchFilter = {
                groupId: groupId
            };

            if (lat && lon) {
                searchFilter.location = {
                    $nearSphere: {
                        $geometry: {
                            type: "Point",
                            coordinates: [lat, lon]
                        },
                        $maxDistance: 50000
                    }
                };
            }

            if (search) {
                searchFilter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { desc: { $regex: search, $options: 'i' } },
                    { tags: { $in: search.split(",") } }
                ];
            }

            const bussiness = await BussinessModel.find(searchFilter);

            const response = {
                status: "Success",
                data: {
                    items: bussiness,
                    totalItemsCount: bussiness.length
                }
            };

            return response;
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }


}

module.exports = new BussinessService(BussinessModel, 'bussiness');
