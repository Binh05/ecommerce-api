import express from "express";
import OrdersController from "../controller/OrdersController.js";
import ROLE from "../config/role.js";
import verifyRoles from "../middleware/verifyRoles.js";
const router = express.Router();

router.route("/").get(OrdersController.index);
router.route("/").post(verifyRoles(ROLE.USER, ROLE.ADMIN), OrdersController.store); // Yêu cầu authentication
router.route("/user/:userId").get(OrdersController.getUserOrders); // Lịch sử đơn hàng của user
router.route("/:id").get(OrdersController.show);
router.route("/:id").put(OrdersController.update);
router.route("/:id").delete(OrdersController.destroy);

export default router;
