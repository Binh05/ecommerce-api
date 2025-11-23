import User from "../model/User.js";
import Product from "../model/Product.js";
import Order from "../model/Order.js";
// mock data
import users from "../mock/mock_users.js";
import products from "../mock/mock_products.js";
import orders from "../mock/mock_orders.js";

import ROLE from "./role.js";
import UserService from "../service/UserService.js";

export const init = async () => {
    try {
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
            await Order.insertMany(orders);
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
