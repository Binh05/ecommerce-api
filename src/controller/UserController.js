import UserService from "../service/UserService.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../model/User.js";

class UserController {
    // GET /api/users - Lấy tất cả users
    async index(req, res, next) {
        try {
            const users = await User.find().select("-password -refreshToken");
            return ApiResponse.success(res, users);
        } catch (err) {
            next(err);
        }
    }

    // GET /api/users/:id - Lấy user theo ID
    async show(req, res, next) {
        try {
            const { id } = req.params;

            // Non-admin can only view their own profile
            if (req.user?.role !== "ADMIN" && req.user?._id?.toString() !== String(id)) {
                return ApiResponse.unauthorized(res, "You do not have permission to access this resource");
            }

            const user = await User.findById(id).select(
                "-password -refreshToken"
            );
            if (!user) return ApiResponse.badRequest(res, "User not found");
            return ApiResponse.success(res, user);
        } catch (err) {
            next(err);
        }
    }

    // GET /api/users/me
    async me(req, res, next) {
        try {
            if (!req.user?._id) return ApiResponse.unauthorized(res, "Unauthorized");
            const user = await User.findById(req.user._id).select("-password -refreshToken");
            if (!user) return ApiResponse.badRequest(res, "User not found");
            return ApiResponse.success(res, user);
        } catch (err) {
            next(err);
        }
    }

    // PUT /api/users/:id - Cập nhật user
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { password, ...updateData } = req.body; // Không cho phép update password qua route này

            // Non-admin can only update their own profile
            if (req.user?.role !== "ADMIN" && req.user?._id?.toString() !== String(id)) {
                return ApiResponse.unauthorized(res, "You do not have permission to access this resource");
            }

            // Whitelist fields that can be updated from client
            const allowed = ["username", "email", "dob", "address", "avatar"];
            const safeUpdate = Object.fromEntries(
                Object.entries(updateData).filter(([key]) => allowed.includes(key))
            );

            const updated = await User.findByIdAndUpdate(id, safeUpdate, {
                new: true,
                runValidators: true,
            }).select("-password -refreshToken");

            if (!updated) return ApiResponse.badRequest(res, "User not found");
            return ApiResponse.success(res, updated);
        } catch (err) {
            next(err);
        }
    }

    // PUT /api/users/me
    async updateMe(req, res, next) {
        try {
            if (!req.user?._id) return ApiResponse.unauthorized(res, "Unauthorized");

            const { password, role, refreshToken, vouchers, isVerified, ...updateData } = req.body;
            const allowed = ["username", "email", "dob", "address", "avatar"];
            const safeUpdate = Object.fromEntries(
                Object.entries(updateData).filter(([key]) => allowed.includes(key))
            );

            const updated = await User.findByIdAndUpdate(req.user._id, safeUpdate, {
                new: true,
                runValidators: true,
            }).select("-password -refreshToken");

            if (!updated) return ApiResponse.badRequest(res, "User not found");
            return ApiResponse.success(res, updated);
        } catch (err) {
            next(err);
        }
    }

    // PUT /api/users/me/password
    async changePassword(req, res, next) {
        try {
            if (!req.user?._id) return ApiResponse.unauthorized(res, "Unauthorized");

            const { currentPassword, newPassword, confirmPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return ApiResponse.badRequest(res, "currentPassword and newPassword are required");
            }
            if (String(newPassword).length < 6) {
                return ApiResponse.badRequest(res, "New password must be at least 6 characters");
            }
            if (confirmPassword !== undefined && String(confirmPassword) !== String(newPassword)) {
                return ApiResponse.badRequest(res, "Password confirmation does not match");
            }

            const user = await User.findById(req.user._id);
            if (!user) return ApiResponse.badRequest(res, "User not found");

            const ok = await user.comparePassword(String(currentPassword));
            if (!ok) return ApiResponse.badRequest(res, "Current password is incorrect");

            user.password = String(newPassword);
            await user.save();

            return ApiResponse.success(res, "Password updated successfully");
        } catch (err) {
            next(err);
        }
    }

    // DELETE /api/users/:id - Xóa user
    async destroy(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await User.findByIdAndDelete(id);
            if (!deleted) return ApiResponse.badRequest(res, "User not found");
            return ApiResponse.success(res, "User deleted successfully");
        } catch (err) {
            next(err);
        }
    }

    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            const result = await UserService.register(
                username,
                email,
                password
            );

            const refreshToken = result.refreshToken;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });

            return ApiResponse.success(res, result.accessToken);
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await UserService.login(email, password);
            const refreshToken = result.refreshToken;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });

            return ApiResponse.success(res, {
                accessToken: result.accessToken,
                role: result.role,
            });
        } catch (err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { accessToken, userId } = await UserService.refresh(
                refreshToken
            );

            return ApiResponse.success(res, { accessToken, userId });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) return res.sendStatus(204);

            const isLogout = await UserService.logout(refreshToken);
            res.clearCookie("refreshToken");

            if (isLogout)
                return ApiResponse.success(res, "Logged out successfully");
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();
