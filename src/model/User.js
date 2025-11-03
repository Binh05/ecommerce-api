import mongoose from "mongoose";
import ROLE from "../config/role.js";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    dob: {type: Date},
    address: {type: String},
    role: {type: String, enum: [ROLE.ADMIN, ROLE.USER], default: ROLE.USER},
    avatar:  {type: String, default: "https://res.cloudinary.com/desoarfu8/image/upload/v1759995051/images_ixruc3.png"},
    isVerified: {type: Boolean, default: true}
}, 
{timestamps: true});

export default mongoose.model("User", userSchema);