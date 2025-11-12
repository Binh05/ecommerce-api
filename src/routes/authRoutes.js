import express from "express";
import UserController from "../controller/UserController.js";
import verifyRoles from "../middleware/verifyRoles.js";
import ROLE from "../config/role.js";
const router = express.Router();

router.route("/register").post(UserController.register);
router.route("/login").post(UserController.login);
router.route("/refresh").post(UserController.refresh);
router.route("/logout").post(UserController.logout);
router.route("/test").get(verifyRoles("user", "admin"), UserController.test);
router.route("/").get(UserController.index);

export default router;
