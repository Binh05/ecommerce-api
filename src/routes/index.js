import userRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import errorHandler from "../middleware/errorHandler.js";

export default function router(app) {
    app.use("/api/auth", userRoutes);
    app.use("/api/products", productRoutes);
    app.use(errorHandler);
}
