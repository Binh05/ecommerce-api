import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        customer: { type: String, required: true },
        email: { type: String, required: true },
        total: { type: Number, required: true },
        status: { 
            type: String, 
            enum: ["Đã xác nhận", "Chờ xác nhận"], 
            default: "Chờ xác nhận" 
        },
        date: { type: Date, default: Date.now },
        items: [orderItemSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
