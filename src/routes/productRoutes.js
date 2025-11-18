import express from "express";
import ProductController from "../controller/ProductsController.js";
const router = express.Router();

router.route("/").get(ProductController.index);
router.route("/").post(ProductController.store);
router.route("/:id").get(ProductController.show);
router.route("/:id").put(ProductController.update);
router.route("/:id").delete(ProductController.destroy);

export default router;
