import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
    {
        code: { 
            type: String, 
            required: true, 
            unique: true,
            uppercase: true,
            trim: true
        },
        
        // Thời gian nhận voucher
        receiveStartTime: { 
            type: Date, 
            required: true 
        },
        receiveEndTime: { 
            type: Date, 
            required: true 
        },
        
        // Thời gian hiệu lực (số ngày từ khi nhận)
        validityDays: { 
            type: Number, 
            required: true,
            min: 1
        },
        
        // Điều kiện sử dụng
        minimumPurchase: { 
            type: Number, 
            required: true,
            default: 0
        },
        
        // Giảm giá theo số tiền cố định
        discountAmount: { 
            type: Number,
            default: 0,
            min: 0
        },
        
        // Giảm giá theo phần trăm
        discountPercent: { 
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        
        // Giảm tối đa (khi dùng phần trăm)
        maxDiscount: { 
            type: Number,
            default: 0,
            min: 0
        },
        
        // Mô tả voucher
        description: { 
            type: String 
        },
        
        // Số lượng voucher có sẵn
        totalQuantity: { 
            type: Number,
            required: true,
            min: 0
        },
        
        // Số lượng đã được nhận
        claimedCount: { 
            type: Number,
            default: 0,
            min: 0
        },
        
        // Số lượng đã được sử dụng
        usedCount: { 
            type: Number,
            default: 0,
            min: 0
        },
        
        // Trạng thái voucher
        isActive: { 
            type: Boolean, 
            default: true 
        }
    },
    { timestamps: true }
);

// Validate: phải có ít nhất một loại giảm giá
voucherSchema.pre("save", function(next) {
    if (this.discountAmount === 0 && this.discountPercent === 0) {
        next(new Error("Voucher must have either discountAmount or discountPercent"));
    }
    
    // Nếu dùng discountAmount thì không cần maxDiscount
    if (this.discountAmount > 0 && this.discountPercent > 0) {
        next(new Error("Voucher cannot have both discountAmount and discountPercent"));
    }
    
    next();
});

// Method tính số tiền giảm
voucherSchema.methods.calculateDiscount = function(orderTotal) {
    if (orderTotal < this.minimumPurchase) {
        return 0;
    }
    
    if (this.discountAmount > 0) {
        return this.discountAmount;
    }
    
    if (this.discountPercent > 0) {
        const discountAmount = (orderTotal * this.discountPercent) / 100;
        if (this.maxDiscount > 0) {
            return Math.min(discountAmount, this.maxDiscount);
        }
        return discountAmount;
    }
    
    return 0;
};

// Method kiểm tra voucher còn hiệu lực không
voucherSchema.methods.isValid = function(claimedDate) {
    const now = new Date();
    
    // Kiểm tra còn active không
    if (!this.isActive) return false;
    
    // Kiểm tra còn voucher không
    if (this.claimedCount >= this.totalQuantity) return false;
    
    // Nếu có claimedDate, kiểm tra thời hạn sử dụng
    if (claimedDate) {
        const expiryDate = new Date(claimedDate);
        expiryDate.setDate(expiryDate.getDate() + this.validityDays);
        if (now > expiryDate) return false;
    }
    
    return true;
};

// Method kiểm tra có trong thời gian nhận không
voucherSchema.methods.canClaim = function() {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.receiveStartTime &&
        now <= this.receiveEndTime &&
        this.claimedCount < this.totalQuantity
    );
};

export default mongoose.model("Voucher", voucherSchema);
