import express from "express";
import OrdersController from "../controller/OrdersController.js";
const router = express.Router();

router.route("/").get(OrdersController.index);
router.route("/").post(OrdersController.store);
router.route("/:id").get(OrdersController.show);
router.route("/:id").put(OrdersController.update);
router.route("/:id").delete(OrdersController.destroy);

export default router;
