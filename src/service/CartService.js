import Cart from "../model/Cart.js";
import Product from "../model/Product.js";

class CartService {
    // Lấy giỏ hàng của người dùng
    async getCartByUserId(userId) {
        let cart = await Cart.findOne({ userId }).populate('products.product');
        if (!cart) {
            cart = new Cart({ userId, products: [] });
            await cart.save();
        }
        return cart;
    }
    // Thêm sản phẩm vào giỏ hàng
    async addToCart(userId, productId, quantity) {
        const cart = await this.getCartByUserId(userId);
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        const existingItemIndex = cart.products.findIndex(item => item.product._id == productId);
        if (existingItemIndex >= 0) {
            cart.products[existingItemIndex].quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity,
                price: product.price
            });
        }
        await cart.save();
        return cart;
    }
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartItem(userId, productId, quantity) {
        const cart = await this.getCartByUserId(userId);
        const itemIndex = cart.products.findIndex(item => item.product._id == productId);
        if (itemIndex >= 0) {
            if (quantity <= 0) {
                cart.products.splice(itemIndex, 1);
            } else {
                cart.products[itemIndex].quantity = quantity;
            }
            await cart.save();
        }
        return cart;
    }
    // Xóa sản phẩm khỏi giỏ hàng
    async removeFromCart(userId, productId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = cart.products.filter(item => item.product._id != productId);
        await cart.save();
        return cart;
    }

    // Xóa toàn bộ giỏ hàng
    async clearCart(userId) {
        const cart = await this.getCartByUserId(userId);
        cart.products = [];
        await cart.save();
        return cart;
    }

    // Tính tổng giá trị giỏ hàng
    async calculateTotal(userId) {
        const cart = await this.getCartByUserId(userId);
        let total = 0;
        cart.products.forEach(item => {
            total += item.price * item.quantity;
        });
        return total;
    }        

}

export default new CartService();