import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import orderRoutes from "./orderRoutes.js";
import userRoutes from "./userRoutes.js";
import voucherRoutes from "./voucherRoutes.js";
import cartRoutes from "./cartRoutes.js";
import errorHandler from "../middleware/errorHandler.js";

export default function router(app) {
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/vouchers", voucherRoutes);
    app.use(errorHandler);
}
