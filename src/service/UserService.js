import User from "../model/User.js";
import AppError from "../utils/AppError.js";
import bcrypt from "bcryptjs";

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
};

export default new UserService();