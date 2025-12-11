import mongoose from "mongoose";
import ROLE from "../config/role.js";
import bcrypt from "bcryptjs";

const userVoucherSchema = new mongoose.Schema({
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        required: true
    },
    claimedAt: {
        type: Date,
        default: Date.now
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    dob: {type: Date},
    address: {type: String},
    role: {type: String, enum: [ROLE.ADMIN, ROLE.USER], default: ROLE.USER},
    avatar:  {type: String, default: "https://res.cloudinary.com/desoarfu8/image/upload/v1759995051/images_ixruc3.png"},
    refreshToken: {type: String},
    isVerified: {type: Boolean, default: true},
    vouchers: [userVoucherSchema]
}, 
{timestamps: true});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);