import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import ApiResponse from "../utils/ApiResponse.js";

class OrdersController {
	// GET /api/orders
	async index(req, res, next) {
		try {
			const orders = await Order.find()
				.populate('user', 'username email avatar')
				.populate('items.product', 'title thumbnail price')
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
				.populate('items.product', 'title thumbnail price stock');
			if (!order) return ApiResponse.badRequest(res, "Order not found");
			return ApiResponse.success(res, order);
		} catch (err) {
			next(err);
		}
	}

	// POST /api/orders
	async store(req, res, next) {
		try {
			const { userId, userEmail, items, shippingAddress, paymentMethod, note } = req.body;

			// Validate request
			if (!items || items.length === 0) {
				return ApiResponse.badRequest(res, "Items are required");
			}

			// Find user by userId or userEmail
			let user;
			if (userId) {
				user = await User.findById(userId);
			} else if (userEmail) {
				user = await User.findOne({ email: userEmail });
			} else {
				return ApiResponse.badRequest(res, "userId or userEmail is required");
			}

			if (!user) {
				return ApiResponse.badRequest(res, "User not found");
			}

			// Validate products and calculate total
			let total = 0;
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

				total += product.price * item.quantity;
			}

			// Generate sequential order ID
			const maxOrder = await Order.findOne().sort({ id: -1 }).limit(1);
			const newId = maxOrder ? String(parseInt(maxOrder.id) + 1) : "1";

			// Create order
			const newOrder = new Order({
				id: newId,
				user: user._id,
				items: orderItems,
				total,
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

			// Populate before returning
			const populatedOrder = await Order.findById(saved._id)
				.populate('user', 'username email avatar address')
				.populate('items.product', 'title thumbnail price stock category');

			console.log(`✅ Order ${newId} created successfully for user ${user.email}`);
			console.log(`📦 Products: ${productDetails.map(p => `${p.title} (x${p.quantity})`).join(', ')}`);
			console.log(`💰 Total: $${total}`);

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
}

export default new OrdersController();

