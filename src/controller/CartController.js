import CartService from "../service/CartService.js";

class CartController {
    // Lấy giỏ hàng của người dùng
    async getCart(req, res) {
        try {
            const userId = req.user._id.toString();
            const cart = await CartService.getCartByUserId(userId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cart = await CartService.addToCart(
                userId,
                productId,
                quantity
            );
            res.status(200).json(cart);
        } catch (error) {
            console.error("Loi khi chay ham add cart", error);
            res.status(500).json({ message: error.message });
        }
    }
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartItem(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body;
            const cart = await CartService.updateCartItem(
                userId,
                productId,
                quantity
            );
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.body;
            const cart = await CartService.removeFromCart(userId, productId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // Xóa toàn bộ giỏ hàng
    async clearCart(req, res) {
        try {
            const userId = req.user.id;
            const cart = await CartService.clearCart(userId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new CartController();
