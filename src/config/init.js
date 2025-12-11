import User from "../model/User.js";
import Product from "../model/Product.js";
import Order from "../model/Order.js";
import Voucher from "../model/Voucher.js";
// mock data
import users from "../mock/mock_users.js";
import products from "../mock/mock_products.js";
import orders from "../mock/mock_orders.js";
import vouchers from "../mock/mock_vouchers.js";

import ROLE from "./role.js";
import UserService from "../service/UserService.js";

export const init = async () => {
    try {
        // --- Init Vouchers (phải init trước để có _id cho users và orders reference) ---
        const voucherCount = await Voucher.countDocuments();
        if (voucherCount === 0) {
            await Voucher.insertMany(vouchers);
            console.log(`Inserted ${vouchers.length} vouchers.`);
        } else {
            console.log("Vouchers already initialized, skipping.");
        }

        // --- Init Users ---
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            // Create users using the same flow as registration so that
            // passwords, refresh tokens and any related logic are applied.
            for (const u of users) {
                try {
                    // Use the service register to create user and generate tokens
                    await UserService.register(u.username, u.email, String(u.password));

                    // Update additional fields not handled by register
                    const extra = {};
                    if (u.dob) extra.dob = u.dob;
                    if (u.address) extra.address = u.address;
                    if (u.role) extra.role = u.role;
                    if (u.avatar) extra.avatar = u.avatar;
                    if (typeof u.isVerified !== 'undefined') extra.isVerified = u.isVerified;

                    // Handle vouchers - convert voucherCode to voucher ObjectId reference
                    if (u.vouchers && Array.isArray(u.vouchers) && u.vouchers.length > 0) {
                        const voucherRefs = [];
                        for (const v of u.vouchers) {
                            const voucherDoc = await Voucher.findOne({ code: v.voucherCode });
                            if (voucherDoc) {
                                voucherRefs.push({
                                    voucher: voucherDoc._id,
                                    claimedAt: v.claimedAt,
                                    isUsed: v.isUsed
                                });
                            }
                        }
                        if (voucherRefs.length > 0) {
                            extra.vouchers = voucherRefs;
                        }
                    }

                    if (Object.keys(extra).length > 0) {
                        await User.findOneAndUpdate({ email: u.email }, extra, { new: true });
                    }
                } catch (err) {
                    // Log and continue with remaining users
                    console.error(`Failed to create user ${u.email}:`, err && err.message ? err.message : err);
                }
            }
            console.log(`Inserted ${users.length} users via register flow.`);
        } else {
            console.log("Users already initialized, skipping.");
        }

        // --- Init Products ---
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany(products);
            console.log(`Inserted ${products.length} products.`);
        } else {
            console.log("Products already initialized, skipping.");
        }

        // --- Init Orders ---
        const orderCount = await Order.countDocuments();
        if (orderCount === 0) {
            // Convert email to user ObjectId, product names to product ObjectIds, and voucherCode to voucher ObjectId
            const ordersWithRefs = await Promise.all(orders.map(async (order) => {
                const orderCopy = { ...order };
                
                // Find user by email and set user reference
                const userDoc = await User.findOne({ email: order.email });
                if (userDoc) {
                    orderCopy.user = userDoc._id;
                }
                
                // Convert product IDs to product ObjectId references
                if (order.items && Array.isArray(order.items)) {
                    const itemsWithRefs = await Promise.all(order.items.map(async (item) => {
                        // Tìm sản phẩm theo productId (nếu có) hoặc name (fallback cho dữ liệu cũ)
                        let productDoc = null;
                        if (item.productId) {
                            productDoc = await Product.findOne({ id: item.productId });
                        } else if (item.name) {
                            productDoc = await Product.findOne({ title: item.name });
                        }
                        
                        if (!productDoc) {
                            console.warn(`Product not found for item:`, item);
                            return null;
                        }
                        
                        return {
                            product: productDoc._id,
                            quantity: item.quantity,
                            price: item.price
                        };
                    }));
                    orderCopy.items = itemsWithRefs.filter(item => item !== null);
                }
                
                // Handle appliedVouchers - convert voucherCode to voucher reference
                if (order.appliedVouchers && Array.isArray(order.appliedVouchers) && order.appliedVouchers.length > 0) {
                    const voucherRefs = [];
                    for (const av of order.appliedVouchers) {
                        const voucherDoc = await Voucher.findOne({ code: av.voucherCode });
                        if (voucherDoc) {
                            voucherRefs.push({
                                voucher: voucherDoc._id,
                                code: av.voucherCode,
                                discountAmount: av.discountAmount
                            });
                        }
                    }
                    orderCopy.appliedVouchers = voucherRefs;
                }
                
                return orderCopy;
            }));
            
            await Order.insertMany(ordersWithRefs);
            console.log(`Inserted ${orders.length} orders.`);
        } else {
            console.log("Orders already initialized, skipping.");
        }
        console.log("Init Done");
    } catch (err) {
        console.error("Init data error:", err);
        process.exit(1);
    }
};
