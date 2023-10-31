const { default: mongoose, model } = require("mongoose");
const CartModel = require("../schema/cart.schema");
const BaseService = require("@baapcompany/core-api/services/base.service");
const ServiceResponse = require("@baapcompany/core-api/services/serviceResponse");
const Products = require("../schema/products.schema");
const productService = require("../services/products.service");
const productsService = require("../services/products.service");

class CartService extends BaseService {
    constructor(dbModel, entityName) {
        super(dbModel, entityName);
    }
    getAllDataByGroupId(groupId, criteria) {
        const query = {
            groupId: groupId,
        };
        if (criteria.userId) query.userId = criteria.userId;
        if (criteria.name) query.name = new RegExp(criteria.name, "i");
        if (criteria.code) query.code = new RegExp(criteria.code, "i");

        return this.preparePaginationAndReturnData(query, criteria);
    }

    // async saveProductInCart(details) {
    //     return this.execute(async () => {
    //         let createCart = await this.model.findOne({
    //             groupId: details.groupId,
    //             userId: new mongoose.Types.ObjectId(details.userId),
    //         });
    //         if (!createCart) {
    //             createCart = await this.model.create({
    //                 groupId: details.groupId,
    //                 userId: new mongoose.Types.ObjectId(details.userId),
    //                 products: details.products,
    //             });
    //         } else {
    //             // Convert product IDs to ObjectIds
    //             const productIds = details.products.map(
    //                 (productId) => new mongoose.Types.ObjectId(productId)
    //             );

    //             // Filter out duplicate product IDs before concatenating
    //             const uniqueProductIds = productIds.filter(
    //                 (productId) => !createCart.products.includes(productId)
    //             );

    //             createCart.products =
    //                 createCart.products.concat(uniqueProductIds);
    //             await createCart.save();
    //         }

    //         // Populate the saved products data
    //         let cart = await this.model
    //             .findOne({
    //                 groupId: details.groupId,
    //                 userId: new mongoose.Types.ObjectId(details.userId),
    //             })
    //             .populate("products");

    //         return cart;
    //     });
    // }

    async saveProductInCart(details) {
        return this.execute(async () => {
            const { groupId, userId, products } = details;

            let createCart = await this.model.findOne({
                groupId,
                userId: new mongoose.Types.ObjectId(userId),
            });
            if (!createCart) {
                createCart = await this.model.create({
                    groupId,
                    userId: new mongoose.Types.ObjectId(userId),
                    products: products.map((product) => ({
                        productId: String(product.productId),
                        quantity: product.quantity,
                    })),
                });
              
            } else {
                const existingProductIds =  createCart?.products?.map((product) =>
                        product.productId?._id.toString()  
                );
               
                let hasDuplicate = false;
                products.forEach((product) => {
                    const productId = product.productId?.toString();
                    if (existingProductIds.includes(productId)) {
                        hasDuplicate = true;
                        return;
                    }

                    createCart.products.push({
                        productId: String(product.productId),
                        quantity: product.quantity,
                    });
                });
                
                if (hasDuplicate) {
                    return {
                        status: "Failed",
                        message: "Product already exists in the cart.",
                    };
                }

                await createCart.save();
            }

            const cart = await this.model
                .findOne({
                    groupId,
                    userId: new mongoose.Types.ObjectId(userId),
                })
                .populate("products");

            return {
                status: "Success",
                data: cart,
            };
        });
    }
    async getAllProductsByCartId(cartId, name) {
        const query = { _id: cartId };
        const populateOptions = {
            path: "products.productId",
            match: name ? { name: { $regex: name, $options: "i" } } : {},
        };

        const cart = await this.model
            .findOne(query)
            .populate(populateOptions)
            .lean();

        if (cart && cart.products && name) {
            cart.products = cart.products.filter((product) =>
                product.productId.name
                    .toLowerCase()
                    .includes(name.toLowerCase())
            );
        }

        const response = {
            data: cart,
        };

        return response;
    }

    async getProductById(productId) {
        return productsService.getById(productId);
    }

    // async getProductByUserId(groupId, userId,name) {
    //     const query = { userId: userId, groupId: groupId };
    //     const populateOptions = {
    //         path: "products",
    //         match: name ? { name: { $regex: name, $options: "i" } } : {},
    //     };

    //     const cart = await this.model
    //         .findOne(query)
    //         .populate(populateOptions)
    //         .lean();

    //     if (cart && cart.products && name) {
    //         cart.products = cart.products.filter((product) =>
    //             product.name.toLowerCase().includes(name.toLowerCase())
    //         );
    //     }

    //     const response = {
    //         data: cart,
    //     };

    //     return response;
    // }
    async getProductByUserId(groupId, userId, name) {
        const query = { userId: userId, groupId: groupId };
        const populateOptions = {
            path: "products",
            populate: { path: "productId" }, // Populate the productId field
            match: name
                ? { "productId.name": { $regex: name, $options: "i" } }
                : {},
        };
        const cart = await this.model
            .findOne(query)
            .populate(populateOptions)  
            .lean();

        if (cart && cart.products && name) {
            cart.products = cart.products.filter((product) =>
                product.productId.name
                    .toLowerCase()
                    .includes(name.toLowerCase())
            );
        }
        let totalCartPrice = 0; // Initialize total cart price to 0
        if (cart && cart.products) {
            totalCartPrice = cart.products.reduce(
                (total, product) =>
                    total + product.quantity * product.productId.buying_price,
                0
            );
        }
        const response = {
            data: cart,
            totalCartPrice: totalCartPrice, // Include total cart price in the response
        };
        return response;
    }

    async deleteProductByCart(cartId, productId) {
        
        return this.updateById(cartId, {
          $pull: { products: { productId: productId } },
        });
      
      }
      
}

module.exports = new CartService(CartModel, "cart");
