const AttendanceModel = require("../schema/attendance.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class AttendanceService extends BaseService {
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

module.exports = new AttendanceService(AttendanceModel, "attendance");
