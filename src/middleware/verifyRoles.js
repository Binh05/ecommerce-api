import User from "../model/User.js";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/ApiResponse.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "mysecretkey";

const verifyRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const headerToken = req.headers["authorization"]?.split(" ")[1];
            const token = headerToken;
            if (!token) {
                return ApiResponse.unauthorized(res, "No token provided");
            }
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                const user = await User.findById(decoded.id).select(
                    "-password"
                );
                if (!user) {
                    return ApiResponse.badRequest(res, "User not found");
                }

                if (!allowedRoles.includes(user.role)) {
                    return ApiResponse.unauthorized(
                        res,
                        "You do not have permission to access this resource"
                    );
                }

                req.user = user;
                next();
            } catch (error) {
                return ApiResponse.error(res, "Invalid token", 401);
            }
        } catch (error) {
            return ApiResponse.error(res, "Server error", 500);
        }
    };
};

export default verifyRoles;
