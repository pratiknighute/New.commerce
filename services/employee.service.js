const EmployeeModel = require("../schema/employee.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");

class EmployeeService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        if (criteria.phoneNo) query.phoneNo = criteria.phoneNo;
        if (criteria.RFID) query.RFID = criteria.RFID;

        if (criteria.role) query.role = new RegExp(criteria.role, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }
    async getByGroupId(groupId, RFID) {
        return this.execute(async () => {
            const query = {
                groupId: groupId,
                RFID:RFID
            };
           
            return await this.getAllByCriteria(query);
        });
    }
    async getByEmpId(empId) {
        return this.execute(() => {
            return this.model.findOne({ empId: empId });
        });
    }
    async deleteAddressByEmpId(empId, addressId) {
        let employee = await EmployeeModel.findOne({ _id: empId });
        employee.addresses.forEach((element, index) => {
            if (element._id == addressId) {
                employee.addresses.splice(index, 1);
                return;
            }
        });
        const updatedEmployee = await EmployeeModel.findOneAndUpdate(
            { _id: empId },
            employee,
            { new: true }
        );
        if (!updatedEmployee) {
            return {
                status: "Failed",
                message: "Failed to update Employee",
            };
        }

        return {
            status: "Success",
            data: updatedEmployee,
            message: "Address deleted successfully",
        };
    }
    // async updateEmployee(empId, data) {
    //     try {
    //         const resp = await EmployeeModel.findOneAndUpdate(
    //             { empId: empId },

    //             data,
    //             { upsert: true, new: true }
    //         );

    //         return new ServiceResponse({
    //             data: resp,
    //         });
    //     } catch (error) {
    //         return new ServiceResponse({
    //             isError: true,
    //             message: error.message,
    //         });
    //     }
    // }
    async updateEmployee(empId, updatedData) {
        try {
            const employee = await EmployeeModel.findOneAndUpdate(
                { empId },
                { $set: updatedData },
                { new: true }
            );

            if (!employee) {
                return {
                    status: "Failed",
                    message: "Employee not found",
                };
            }

            return {
                status: "Success",
                data: employee,
            };
        } catch (error) {
            console.error(error);
            return {
                status: "Failed",
                message: "Failed to update employee",
            };
        }
    }
}

module.exports = new EmployeeService(EmployeeModel, "employee");
