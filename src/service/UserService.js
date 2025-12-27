import User from "../model/User.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/Token.js";
import jwt from "jsonwebtoken";

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "mysecretkey";
class UserService {
    async register(username, email, password) {
        if (!username || !email || !password)
            throw new AppError("All fields are required");

        const isExistUser = await User.exists({ email: email });
        if (isExistUser) throw new AppError("Email has been used");

        const newUser = await User.create({ email, username, password });
        const refreshToken = generateRefreshToken(newUser);
        const accessToken = generateAccessToken(newUser);

        newUser.refreshToken = refreshToken;
        newUser.save();

        return {
            refreshToken,
            accessToken,
        };
    }

    async login(email, password) {
        if (!email || !password) throw new AppError("All fields are request");

        const user = await User.findOne({ email: email });
        if (!user) throw new AppError("User not found");

        const isValid = await user.comparePassword(password);
        if (!isValid) throw new AppError("Email or Password is invalid");

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        user.save();

        return {
            refreshToken,
            accessToken,
            role: user.role,
            _id: user._id,
        };
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw new AppError("No refresh token", 401);

        const user = await User.findOne({ refreshToken });
        if (!user) throw new AppError("Invalid refresh token");

        let accessToken = null;
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || user._id.toString() !== decoded.id)
                throw new AppError("Invalid refresh token");

            accessToken = generateAccessToken(user);
        });
        return { accessToken, userId: user._id };
    }

    async logout(refreshToken) {
        const user = await User.findOne({ refreshToken });
        if (!user) return res.sendStatus(204);

        user.refreshToken = null;
        await user.save();
        return true;
    }
}

export default new UserService();
