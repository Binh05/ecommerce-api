import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Voucher from "../model/Voucher.js";
import Cart from "../model/Cart.js";
import ApiResponse from "../utils/ApiResponse.js";

class OrdersController {
	// GET /api/orders
	async index(req, res, next) {
		try {
			const orders = await Order.find()
				.populate('user', 'username email avatar')
				.populate('items.product', 'title thumbnail price')
				.populate('appliedVouchers.voucher', 'code description discountAmount discountPercent maxDiscount')
				.sort({ date: -1 });
			return ApiResponse.success(res, orders);
		} catch (err) {
			next(err);
		}
	}

	// GET /api/orders/:id
	async show(req, res, next) {
		try {
			const { id } = req.params;
			const order = await Order.findOne({ id: String(id) })
				.populate('user', 'username email avatar address')
				.populate('items.product', 'title thumbnail price stock')
				.populate('appliedVouchers.voucher', 'code description discountAmount discountPercent maxDiscount');
			if (!order) return ApiResponse.badRequest(res, "Order not found");
			return ApiResponse.success(res, order);
		} catch (err) {
			next(err);
		}
	}

	// POST /api/orders
	async store(req, res, next) {
		try {
			const userId = req.user.id; // Lấy từ authenticated user
			const { items, shippingAddress, paymentMethod, note, voucherCodes } = req.body;

			// Validate request
			if (!items || items.length === 0) {
				return ApiResponse.badRequest(res, "Items are required");
			}

			// Find user by authenticated userId
			const user = await User.findById(userId).populate('vouchers.voucher');
			if (!user) {
				return ApiResponse.badRequest(res, "User not found");
			}

			// Validate products and calculate total
			let originalTotal = 0;
			const orderItems = [];
			const productDetails = []; // For detailed validation messages

			for (const item of items) {
				// Validate item structure
				if (!item.productId || !item.quantity) {
					return ApiResponse.badRequest(res, "Each item must have productId and quantity");
				}

				if (item.quantity <= 0) {
					return ApiResponse.badRequest(res, "Quantity must be greater than 0");
				}

				// Find product by MongoDB _id or custom id field
				let product = await Product.findById(item.productId);
				if (!product) {
					// Try finding by custom id field
					product = await Product.findOne({ id: parseInt(item.productId) });
				}

				if (!product) {
					return ApiResponse.badRequest(res, `Product with ID ${item.productId} not found`);
				}

				if (product.stock < item.quantity) {
					return ApiResponse.badRequest(
						res, 
						`Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`
					);
				}

				orderItems.push({
					product: product._id,
					quantity: item.quantity,
					price: product.price
				});

				productDetails.push({
					productId: product._id,
					title: product.title,
					quantity: item.quantity
				});

				originalTotal += product.price * item.quantity;
			}

			// Process vouchers
			let totalDiscount = 0;
			const appliedVouchers = [];

			if (voucherCodes && voucherCodes.length > 0) {
				for (const code of voucherCodes) {
					// Tìm voucher trong user's vouchers
					const userVoucher = user.vouchers.find(
						v => v.voucher && v.voucher.code === code.toUpperCase() && !v.isUsed
					);

					if (!userVoucher) {
						return ApiResponse.badRequest(res, `You don't have voucher: ${code}`);
					}

					const voucher = userVoucher.voucher;

					// Kiểm tra voucher còn hiệu lực
					if (!voucher.isValid(userVoucher.claimedAt)) {
						return ApiResponse.badRequest(res, `Voucher ${code} has expired`);
					}

					// Kiểm tra minimum purchase
					if (originalTotal < voucher.minimumPurchase) {
						return ApiResponse.badRequest(
							res, 
							`Voucher ${code} requires minimum purchase of $${voucher.minimumPurchase}`
						);
					}

					// Tính discount
					const discount = voucher.calculateDiscount(originalTotal);
					totalDiscount += discount;

					appliedVouchers.push({
						voucher: voucher._id,
						code: voucher.code,
						discountAmount: discount
					});

					// Đánh dấu voucher đã dùng trong user
					userVoucher.isUsed = true;

					// Tăng usedCount của voucher
					voucher.usedCount += 1;
					await voucher.save();
				}

				// Lưu user sau khi đánh dấu vouchers
				await user.save();
			}

			// Calculate final total
			const finalTotal = Math.max(0, originalTotal - totalDiscount);

			// Generate sequential order ID
			const maxOrder = await Order.findOne().sort({ id: -1 }).limit(1);
			const newId = maxOrder ? String(parseInt(maxOrder.id) + 1) : "1";

			// Create order
			const newOrder = new Order({
				id: newId,
				user: user._id,
				items: orderItems,
				originalTotal,
				discount: totalDiscount,
				total: finalTotal,
				appliedVouchers,
				shippingAddress: shippingAddress || user.address || "N/A",
				paymentMethod: paymentMethod || "COD",
				note: note || ""
			});

			const saved = await newOrder.save();

			// Update product stock
			for (let i = 0; i < orderItems.length; i++) {
				await Product.findByIdAndUpdate(
					orderItems[i].product,
					{ $inc: { stock: -orderItems[i].quantity } }
				);
			}

			//remove purchased items from user's cart
			const cart = await Cart.findOne({ userId: user._id });
			if (cart) {
				cart.products = cart.products.filter(cartItem => 
					!orderItems.some(orderItem => orderItem.product.equals(cartItem.product))
				);
				await cart.save();
			}

			// Populate before returning
			const populatedOrder = await Order.findById(saved._id)
				.populate('user', 'username email avatar address')
				.populate('items.product', 'title thumbnail price stock category')
				.populate('appliedVouchers.voucher', 'code description');

			console.log(`✅ Order ${newId} created successfully for user ${user.email}`);
			console.log(`📦 Products: ${productDetails.map(p => `${p.title} (x${p.quantity})`).join(', ')}`);
			console.log(`💰 Original Total: $${originalTotal}`);
			if (totalDiscount > 0) {
				console.log(`🎟️ Vouchers Applied: ${appliedVouchers.map(v => v.code).join(', ')}`);
				console.log(`💸 Total Discount: $${totalDiscount}`);
			}
			console.log(`💳 Final Total: $${finalTotal}`);

			return ApiResponse.success(res, populatedOrder, 201);
		} catch (err) {
			console.error("Error creating order:", err);
			next(err);
		}
	}

	// PUT /api/orders/:id
	async update(req, res, next) {
		try {
			const { id } = req.params;
			const { status } = req.body;

			// Only allow status updates
			if (!status) {
				return ApiResponse.badRequest(res, "Status is required");
			}

			const updated = await Order.findOneAndUpdate(
				{ id: String(id) },
				{ status },
				{ new: true }
			)
			.populate('user', 'username email avatar')
			.populate('items.product', 'title thumbnail price');

			if (!updated) return ApiResponse.badRequest(res, "Order not found");
			return ApiResponse.success(res, updated);
		} catch (err) {
			console.error("Error updating order:", err);
			next(err);
		}
	}

	// DELETE /api/orders/:id
	async destroy(req, res, next) {
		try {
			const { id } = req.params;
			
			const order = await Order.findOne({ id: String(id) });
			if (!order) return ApiResponse.badRequest(res, "Order not found");

			// Restore product stock if order is cancelled
			if (order.status !== "Đã hủy") {
				for (const item of order.items) {
					await Product.findByIdAndUpdate(
						item.product,
						{ $inc: { stock: item.quantity } }
					);
				}
			}

			await Order.findOneAndDelete({ id: String(id) });
			return ApiResponse.success(res, "Order deleted successfully");
		} catch (err) {
			console.error("Error deleting order:", err);
			next(err);
		}
	}

	// GET /api/orders/user/:userId - Lấy lịch sử đặt hàng của 1 user
	async getUserOrders(req, res, next) {
		try {
			const { userId } = req.params;

			// Tìm user để validate
			const user = await User.findById(userId);
			if (!user) {
				return ApiResponse.badRequest(res, "User not found");
			}

			// Lấy tất cả orders của user, sắp xếp theo ngày mới nhất
			const orders = await Order.find({ user: userId })
				.populate('items.product', 'title thumbnail price category')
				.populate('appliedVouchers.voucher', 'code description discountAmount discountPercent maxDiscount')
				.sort({ date: -1 });

			console.log(`📋 Fetched ${orders.length} orders for user ${user.email}`);

			return ApiResponse.success(res, {
				user: {
					_id: user._id,
					username: user.username,
					email: user.email,
					avatar: user.avatar
				},
				orders: orders,
				totalOrders: orders.length
			});
		} catch (err) {
			console.error("Error fetching user orders:", err);
			next(err);
		}
	}
}

export default new OrdersController();

