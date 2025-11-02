import userRoutes from "./userRoutes.js";

export default function router(app) {
    app.use("/api/user", userRoutes);
}
