const OrderModel = require("../schema/order.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
class OrderService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };
        // if (criteria.name) query.name = new RegExp(criteria.name, "i");
        if (criteria.orderId) query.orderId = criteria.orderId;
        if (criteria.cartId) query.cartId = criteria.cartId;
        if (criteria.shippingId) query.shippingId = criteria.shippingId;
        return this.preparePaginationAndReturnData(query, criteria);
    }
    async updateOrder(orderId, data) {
        try {
            const resp = await OrderModel.findOneAndUpdate(
                { orderId: orderId },
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
    async getByorderId(orderId) {
        return this.execute(() => {
            return this.model.findOne({ orderId: orderId });
        });
    }
    async getByCustId(custId) {
        return this.execute(() => {
            return this.model.findOne({ custId: custId });
            
        },
      
        );
    }
    
}

module.exports = new OrderService(OrderModel, "order");
