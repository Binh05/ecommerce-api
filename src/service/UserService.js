import User from "../model/User.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "mysecretkey";
const ACCESS_TOKEN_EXPIRE = process.env.ACCESS_TOKEN_EXPIRE || "1d"

class UserService {
    async register(username, email, password) {
        if (!username || !email || !password) 
            throw new AppError("All fields are required");

        const isExistUser = await User.exists({email: email});
        if (isExistUser) 
            throw new AppError("Email has been used");

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
        })

        return {
            id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            role: newUser.role,
            avatar: newUser.avatar,
            isVerified: newUser.isVerified
        }
    }

    async login(email, password) {
        if (!email || !password) 
            throw new AppError("All fields are request");

        const user = await User.findOne({email: email});
        const isValid = await bcrypt.compare(password, user.password);
        if (!user || !isValid)
            throw new AppError("Email or Password is invalid");

        const accessToken = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role,
        }, ACCESS_TOKEN_SECRET, {ACCESS_TOKEN_EXPIRE});

        return {
            accessToken,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        };
    }
};

export default new UserService();