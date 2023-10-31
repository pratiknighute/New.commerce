const LeaveModel = require("../schema/leave.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class LeaveService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
}

module.exports = new LeaveService(LeaveModel, "leave");
