import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Giá tại thời điểm đặt hàng
}, { _id: false });

const appliedVoucherSchema = new mongoose.Schema({
    voucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voucher',
        required: true
    },
    code: { type: String, required: true },
    discountAmount: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        total: { type: Number, required: true },
        originalTotal: { type: Number, required: true }, // Tổng tiền trước khi giảm
        discount: { type: Number, default: 0 }, // Tổng số tiền giảm
        status: { 
            type: String, 
            enum: ["Đã xác nhận", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"], 
            default: "Chờ xác nhận" 
        },
        date: { type: Date, default: Date.now },
        items: [orderItemSchema],
        appliedVouchers: [appliedVoucherSchema],
        shippingAddress: { type: String },
        paymentMethod: { type: String, default: "COD" },
        note: { type: String, default: "" },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
