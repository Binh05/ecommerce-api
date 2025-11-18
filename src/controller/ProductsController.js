import Product from "../model/Product.js";
import ApiResponse from "../utils/ApiResponse.js";

class ProductController {
    // GET /api/products
    async index(req, res, next) {
        try {
        const products = await Product.find();
        return ApiResponse.success(res, products);
        } catch (err) {
        next(err);
        }
    }

    // GET /api/products/:id
    async show(req, res, next) {
        try {
        const { id } = req.params;
        const product = await Product.findOne({ id: Number(id) }); 
        if (!product) return ApiResponse.badRequest(res, "Product not found");
        return ApiResponse.success(res, product);
        } catch (err) {
        next(err);
        }
    }

    // POST /api/products
    async store(req, res, next) {
        try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        return ApiResponse.success(res, saved, 201);
        } catch (err) {
        next(err);
        }
    }

    // PUT /api/products/:id
    async update(req, res, next) {
        try {
        const { id } = req.params;
        const updated = await Product.findOneAndUpdate(
            { id: Number(id) },
            req.body,
            { new: true }
        );
        if (!updated) return ApiResponse.badRequest(res, "Product not found");
        return ApiResponse.success(res, updated);
        } catch (err) {
        next(err);
        }
    }

    // DELETE /api/products/:id
    async destroy(req, res, next) {
        try {
        const { id } = req.params;
        const deleted = await Product.findOneAndDelete({ id: Number(id) });
        if (!deleted) return ApiResponse.badRequest(res, "Product not found");
        return ApiResponse.success(res, "Product deleted successfully");
        } catch (err) {
        next(err);
        }
    }
}

export default new ProductController();
