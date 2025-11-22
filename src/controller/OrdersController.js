import Order from "../model/Order.js";
import ApiResponse from "../utils/ApiResponse.js";

class OrdersController {
	// GET /api/orders
	async index(req, res, next) {
		try {
			const orders = await Order.find();
			return ApiResponse.success(res, orders);
		} catch (err) {
			next(err);
		}
	}

	// GET /api/orders/:id
	async show(req, res, next) {
		try {
			const { id } = req.params;
			const order = await Order.findOne({ id: String(id) });
			if (!order) return ApiResponse.badRequest(res, "Order not found");
			return ApiResponse.success(res, order);
		} catch (err) {
			next(err);
		}
	}

	// POST /api/orders
	async store(req, res, next) {
		try {
			const newOrder = new Order(req.body);
			const saved = await newOrder.save();
			return ApiResponse.success(res, saved, 201);
		} catch (err) {
			next(err);
		}
	}

	// PUT /api/orders/:id
	async update(req, res, next) {
		try {
			const { id } = req.params;
			const updated = await Order.findOneAndUpdate(
				{ id: String(id) },
				req.body,
				{ new: true }
			);
			if (!updated) return ApiResponse.badRequest(res, "Order not found");
			return ApiResponse.success(res, updated);
		} catch (err) {
			next(err);
		}
	}

	// DELETE /api/orders/:id
	async destroy(req, res, next) {
		try {
			const { id } = req.params;
			const deleted = await Order.findOneAndDelete({ id: String(id) });
			if (!deleted) return ApiResponse.badRequest(res, "Order not found");
			return ApiResponse.success(res, "Order deleted successfully");
		} catch (err) {
			next(err);
		}
	}
}

export default new OrdersController();

