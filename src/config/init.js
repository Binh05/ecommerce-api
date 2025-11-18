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
            await User.insertMany(users);
            console.log(`Inserted ${users.length} users.`);
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
