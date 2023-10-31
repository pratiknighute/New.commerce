const InventryModel = require("../schema/inventry.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class InventryService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        if (criteria.productId) query.productId = criteria.productId;

        if (criteria.warehouseId) query.warehouseId = criteria.warehouseId;

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new InventryService(InventryModel, 'inventry');
