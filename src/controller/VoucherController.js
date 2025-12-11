import Voucher from "../model/Voucher.js";
import User from "../model/User.js";
import ApiResponse from "../utils/ApiResponse.js";

class VoucherController {
    // GET /api/vouchers - Lấy tất cả vouchers
    async index(req, res, next) {
        try {
            const vouchers = await Voucher.find().sort({ createdAt: -1 });
            return ApiResponse.success(res, vouchers);
        } catch (err) {
            console.error("Error fetching vouchers:", err);
            next(err);
        }
    }

    // GET /api/vouchers/:id - Lấy voucher theo ID
    async show(req, res, next) {
        try {
            const { id } = req.params;
            const voucher = await Voucher.findById(id);
            
            if (!voucher) {
                return ApiResponse.badRequest(res, "Voucher not found");
            }
            
            return ApiResponse.success(res, voucher);
        } catch (err) {
            console.error("Error fetching voucher:", err);
            next(err);
        }
    }

    // GET /api/vouchers/code/:code - Lấy voucher theo code
    async showByCode(req, res, next) {
        try {
            const { code } = req.params;
            const voucher = await Voucher.findOne({ code: code.toUpperCase() });
            
            if (!voucher) {
                return ApiResponse.badRequest(res, "Voucher not found");
            }
            
            return ApiResponse.success(res, voucher);
        } catch (err) {
            console.error("Error fetching voucher by code:", err);
            next(err);
        }
    }

    // GET /api/vouchers/available - Lấy vouchers đang có thể nhận
    async available(req, res, next) {
        try {
            const now = new Date();
            const vouchers = await Voucher.find({
                isActive: true,
                receiveStartTime: { $lte: now },
                receiveEndTime: { $gte: now },
                $expr: { $lt: ["$claimedCount", "$totalQuantity"] }
            }).sort({ receiveEndTime: 1 });
            
            return ApiResponse.success(res, vouchers);
        } catch (err) {
            console.error("Error fetching available vouchers:", err);
            next(err);
        }
    }

    // POST /api/vouchers - Tạo voucher mới
    async store(req, res, next) {
        try {
            const {
                code,
                receiveStartTime,
                receiveEndTime,
                validityDays,
                minimumPurchase,
                discountAmount,
                discountPercent,
                maxDiscount,
                description,
                totalQuantity
            } = req.body;

            // Validation
            if (!code || !receiveStartTime || !receiveEndTime || !validityDays || totalQuantity === undefined) {
                return ApiResponse.badRequest(res, "Missing required fields");
            }

            // Kiểm tra code đã tồn tại chưa
            const existingVoucher = await Voucher.findOne({ code: code.toUpperCase() });
            if (existingVoucher) {
                return ApiResponse.badRequest(res, "Voucher code already exists");
            }

            // Kiểm tra thời gian hợp lệ
            if (new Date(receiveStartTime) >= new Date(receiveEndTime)) {
                return ApiResponse.badRequest(res, "receiveEndTime must be after receiveStartTime");
            }

            const newVoucher = new Voucher({
                code: code.toUpperCase(),
                receiveStartTime,
                receiveEndTime,
                validityDays,
                minimumPurchase: minimumPurchase || 0,
                discountAmount: discountAmount || 0,
                discountPercent: discountPercent || 0,
                maxDiscount: maxDiscount || 0,
                description,
                totalQuantity
            });

            const saved = await newVoucher.save();
            
            console.log(`✅ Voucher created: ${saved.code}`);
            console.log(`📅 Receive: ${saved.receiveStartTime} to ${saved.receiveEndTime}`);
            console.log(`⏱️ Valid for: ${saved.validityDays} days`);
            console.log(`💰 Discount: ${saved.discountAmount > 0 ? `$${saved.discountAmount}` : `${saved.discountPercent}% (max $${saved.maxDiscount})`}`);
            
            return ApiResponse.success(res, saved, 201);
        } catch (err) {
            console.error("Error creating voucher:", err);
            if (err.message.includes("Voucher must have")) {
                return ApiResponse.badRequest(res, err.message);
            }
            next(err);
        }
    }

    // PUT /api/vouchers/:id - Cập nhật voucher
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            // Không cho phép thay đổi claimedCount và usedCount qua API này
            delete updateData.claimedCount;
            delete updateData.usedCount;

            // Uppercase code nếu có
            if (updateData.code) {
                updateData.code = updateData.code.toUpperCase();
            }

            const updated = await Voucher.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updated) {
                return ApiResponse.badRequest(res, "Voucher not found");
            }

            return ApiResponse.success(res, updated);
        } catch (err) {
            console.error("Error updating voucher:", err);
            next(err);
        }
    }

    // DELETE /api/vouchers/:id - Xóa voucher
    async destroy(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Voucher.findByIdAndDelete(id);

            if (!deleted) {
                return ApiResponse.badRequest(res, "Voucher not found");
            }

            return ApiResponse.success(res, "Voucher deleted successfully");
        } catch (err) {
            console.error("Error deleting voucher:", err);
            next(err);
        }
    }

    // POST /api/vouchers/:id/claim - User nhận voucher
    async claim(req, res, next) {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            if (!userId) {
                return ApiResponse.badRequest(res, "userId is required");
            }

            // Tìm voucher
            const voucher = await Voucher.findById(id);
            if (!voucher) {
                return ApiResponse.badRequest(res, "Voucher not found");
            }

            // Kiểm tra voucher có thể nhận không
            if (!voucher.canClaim()) {
                if (!voucher.isActive) {
                    return ApiResponse.badRequest(res, "Voucher is not active");
                }
                if (voucher.claimedCount >= voucher.totalQuantity) {
                    return ApiResponse.badRequest(res, "Voucher is out of stock");
                }
                return ApiResponse.badRequest(res, "Voucher is not available for claiming at this time");
            }

            // Tìm user
            const user = await User.findById(userId);
            if (!user) {
                return ApiResponse.badRequest(res, "User not found");
            }

            // Kiểm tra user đã nhận voucher này chưa
            const alreadyClaimed = user.vouchers.some(
                v => v.voucher.toString() === id && !v.isUsed
            );
            if (alreadyClaimed) {
                return ApiResponse.badRequest(res, "You have already claimed this voucher");
            }

            // Thêm voucher vào user
            user.vouchers.push({
                voucher: voucher._id,
                claimedAt: new Date(),
                isUsed: false
            });
            await user.save();

            // Tăng claimedCount
            voucher.claimedCount += 1;
            await voucher.save();

            console.log(`✅ User ${user.username} claimed voucher ${voucher.code}`);

            return ApiResponse.success(res, {
                message: "Voucher claimed successfully",
                voucher: voucher,
                expiresAt: new Date(Date.now() + voucher.validityDays * 24 * 60 * 60 * 1000)
            });
        } catch (err) {
            console.error("Error claiming voucher:", err);
            next(err);
        }
    }

    // GET /api/vouchers/user/:userId - Lấy vouchers của user
    async getUserVouchers(req, res, next) {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId).populate('vouchers.voucher');
            if (!user) {
                return ApiResponse.badRequest(res, "User not found");
            }

            // Filter vouchers chưa dùng và còn hiệu lực
            const validVouchers = user.vouchers.filter(v => {
                if (v.isUsed) return false;
                if (!v.voucher) return false;
                return v.voucher.isValid(v.claimedAt);
            });

            return ApiResponse.success(res, validVouchers);
        } catch (err) {
            console.error("Error fetching user vouchers:", err);
            next(err);
        }
    }
}

export default new VoucherController();
