import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    comment: { type: String },
    reviewerName: { type: String },
}, { _id: false });

const dimensionSchema = new mongoose.Schema({
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
}, { _id: false });

const metaSchema = new mongoose.Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    barcode: { type: String },
    qrCode: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String },
        brand: { type: String },
        category: { type: String },
        price: { type: Number, required: true },
        discountPercentage: { type: Number },
        rating: { type: Number },
        stock: { type: Number },
        availabilityStatus: { type: String },
        sku: { type: String },
        minimumOrderQuantity: { type: Number },
        returnPolicy: { type: String },
        warrantyInformation: { type: String },
        shippingInformation: { type: String },
        tags: [{ type: String }],
        weight: { type: Number },

        dimensions: dimensionSchema,

        thumbnail: { type: String },
        images: [{ type: String }],

        meta: metaSchema,

        reviews: [reviewSchema],
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
