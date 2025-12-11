import express from "express";
import VoucherController from "../controller/VoucherController.js";
const router = express.Router();

// Public routes
router.route("/available").get(VoucherController.available);
router.route("/code/:code").get(VoucherController.showByCode);
router.route("/user/:userId").get(VoucherController.getUserVouchers);

// CRUD routes
router.route("/").get(VoucherController.index);
router.route("/").post(VoucherController.store);
router.route("/:id").get(VoucherController.show);
router.route("/:id").put(VoucherController.update);
router.route("/:id").delete(VoucherController.destroy);

// Claim voucher
router.route("/:id/claim").post(VoucherController.claim);

export default router;
