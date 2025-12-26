import Product from "../model/Product.js";
import ApiResponse from "../utils/ApiResponse.js";

class ProductController {
    // GET /api/products
    async index(req, res, next) {
        try {
            // Query params: q, category, brand, minPrice, maxPrice, inStock, sort, page, limit
            const {
                q,
                category,
                brand,
                minPrice,
                maxPrice,
                inStock,
                sort,
                page = 1,
                limit = 10,
            } = req.query;

            const filter = {};

            if (q) {
                const regex = new RegExp(q, "i");
                filter.$or = [
                    { title: regex },
                    { description: regex },
                    { tags: { $in: [regex] } },
                ];
            }

            if (category) filter.category = category;
            if (brand) filter.brand = brand;

            if (minPrice !== undefined || maxPrice !== undefined) {
                filter.price = {};
                if (minPrice !== undefined)
                    filter.price.$gte = Number(minPrice);
                if (maxPrice !== undefined)
                    filter.price.$lte = Number(maxPrice);
            }

            if (inStock !== undefined) {
                if (inStock === "true") filter.stock = { $gt: 0 };
                else if (inStock === "false") filter.stock = { $lte: 0 };
            }

            // Build mongoose query
            let mongooseQuery = Product.find(filter);

            // Sorting: support comma separated list, prefix '-' or use field:asc|desc
            if (sort) {
                const sortObj = {};
                sort.split(",").forEach((s) => {
                    s = s.trim();
                    if (!s) return;
                    if (s.includes(":")) {
                        const [field, dir] = s.split(":");
                        sortObj[field] = dir === "desc" ? -1 : 1;
                    } else if (s.startsWith("-")) {
                        sortObj[s.substring(1)] = -1;
                    } else {
                        sortObj[s] = 1;
                    }
                });
                mongooseQuery = mongooseQuery.sort(sortObj);
            }

            const p = Math.max(1, Number(page));
            const lim = Math.max(1, Math.min(100, Number(limit)));
            const skip = (p - 1) * lim;

            const [total, products] = await Promise.all([
                Product.countDocuments(filter),
                mongooseQuery.skip(skip).limit(lim),
            ]);

            return ApiResponse.success(res, {
                page: p,
                limit: lim,
                totalItems: total,
                totalPages: Math.ceil(total / lim),
                data: products,
            });
        } catch (err) {
            next(err);
        }
    }

    // GET /api/products/:id
    async show(req, res, next) {
        try {
            const { id } = req.params;
            const product = await Product.findOne({ _id: id });
            if (!product)
                return ApiResponse.badRequest(res, "Product not found");
            return ApiResponse.success(res, product);
        } catch (err) {
            console.log("loi khi goi show", err);
            next(err);
        }
    }

    // POST /api/products
    async store(req, res, next) {
        try {
            // Validate required fields
            if (!req.body.title || !req.body.price) {
                return ApiResponse.badRequest(
                    res,
                    "Title and price are required"
                );
            }

            // Tìm ID lớn nhất hiện có và tạo ID mới
            const maxProduct = await Product.findOne()
                .sort({ id: -1 })
                .limit(1);
            const newId = maxProduct ? maxProduct.id + 1 : 1;

            const newProduct = new Product({
                ...req.body,
                id: newId,
                meta: {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    ...req.body.meta,
                },
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
                return ApiResponse.badRequest(
                    res,
                    "Title and price are required"
                );
            }

            // Cập nhật metadata thời gian
            const updateData = {
                ...req.body,
                "meta.updatedAt": new Date(),
            };

            const updated = await Product.findOneAndUpdate(
                { id: Number(id) },
                updateData,
                { new: true, runValidators: true }
            );
            if (!updated)
                return ApiResponse.badRequest(res, "Product not found");
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
            if (!deleted)
                return ApiResponse.badRequest(res, "Product not found");
            return ApiResponse.success(res, "Product deleted successfully");
        } catch (err) {
            next(err);
        }
    }
}

export default new ProductController();
