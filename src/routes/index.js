import userRoutes from "./authRoutes.js";
import errorHandler from "../middleware/errorHandler.js";

export default function router(app) {
    app.use("/api/auth", userRoutes);

    app.use(errorHandler);
}
