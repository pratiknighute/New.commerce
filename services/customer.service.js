const CustomerModel = require("../schema/customer.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const CartModel = require("../schema/cart.schema");
const { model } = require("mongoose");
class CustomerService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }

    getAllRequestsByCriteria(criteria) {
        const query = {};

        if (criteria.groupId) {
            query.groupId = criteria.groupId;
        }

        if (criteria.phoneNumber) {
            query.phoneNumber = criteria.phoneNumber;
        }

        return this.getAllByCriteria(query);
    }

    async deleteAddressByCustId(custId, addressId) {
        let customer = await CustomerModel.findOne({ custId: custId });
        customer.addresses.forEach((element, index) => {
            if (element._id == addressId) {
                customer.addresses.splice(index, 1);
                return;
            }
        });
        const updatedCustomer = await CustomerModel.findOneAndUpdate(
            { custId: custId },
            customer,
            { new: true }
        );
        if (!updatedCustomer) {
            return {
                status: "Failed",
                message: "Failed to update customer",
            };
        }

        return {
            status: "Success",
            data: updatedCustomer,
            message: "Address deleted successfully",
        };
    }

    async getByUserId(userId) {
        return this.execute(() => {
            return this.model.findOne({ userId: userId });
        });
    }

    async getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };

        if (criteria.name) query.name = new RegExp(criteria.name, "i");

        if (criteria.phoneNumber) query.phoneNumber = criteria.phoneNumber;
        if (criteria.userId) query.userId = criteria.userId;

        return this.preparePaginationAndReturnData(query, criteria);
    }

    async getByCustId(custId) {
        return this.execute(() => {
            return this.model.findOne({ custId: custId });
        });
    }

    async updateCustomer(custId, data) {
        try {
            const resp = await CustomerModel.findOneAndUpdate(
                { custId: custId },

                data,
                { upsert: true, new: true }
            );

            return new ServiceResponse({
                data: resp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    async updateCustomerByUserId(userId, newAddress, data) {
        try {
            const conditions = { userId: userId };
            const update = {};

            if (newAddress) {
                update.$addToSet = { addresses: newAddress };
            }

            if (data) {
                for (const field in data) {
                    update[field] = data[field];
                }
            }

            const options = { new: true, upsert: true };

            const resp = await CustomerModel.findOneAndUpdate(conditions, update, options);

            return new ServiceResponse({
                data: resp,
            });
        } catch (error) {
            return new ServiceResponse({
                isError: true,
                message: error.message,
            });
        }
    }

    static async registerUser(userDto) {
        try {
            console.log("Entered register method");
            console.log(userDto);
            const response = await axios.post(
                process.env.AUTH_SERVICE_BASE_URL + "auth/user",
                userDto
            );
            console.log("End register method");
            return new ServiceResponse({
                // data: response.data,
            });
        } catch (error) {
            console.log("Error in register method");
            return new ServiceResponse({
                isError: true,
                message: error.response
                    ? error.response.data.messages
                        ? error.response.data.messages
                        : error.response.data.message
                    : error.message,
            });
        }
    }
}

module.exports = new CustomerService(CustomerModel, "customer");
