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
        // Validate required fields
        if (!req.body.title || !req.body.price) {
            return ApiResponse.badRequest(res, "Title and price are required");
        }

        // Tìm ID lớn nhất hiện có và tạo ID mới
        const maxProduct = await Product.findOne().sort({ id: -1 }).limit(1);
        const newId = maxProduct ? maxProduct.id + 1 : 1;
        
        const newProduct = new Product({
            ...req.body,
            id: newId,
            meta: {
                createdAt: new Date(),
                updatedAt: new Date(),
                ...req.body.meta
            }
        });
        const saved = await newProduct.save();
        return ApiResponse.success(res, saved, 201);
        } catch (err) {
        console.error("Error creating product:", err);
        next(err);
        }
    }

    // PUT /api/products/:id
    async update(req, res, next) {
        try {
        const { id } = req.params;
        
        // Validate required fields
        if (!req.body.title || !req.body.price) {
            return ApiResponse.badRequest(res, "Title and price are required");
        }
        
        // Cập nhật metadata thời gian
        const updateData = {
            ...req.body,
            'meta.updatedAt': new Date()
        };
        
        const updated = await Product.findOneAndUpdate(
            { id: Number(id) },
            updateData,
            { new: true, runValidators: true }
        );
        if (!updated) return ApiResponse.badRequest(res, "Product not found");
        return ApiResponse.success(res, updated);
        } catch (err) {
        console.error("Error updating product:", err);
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
