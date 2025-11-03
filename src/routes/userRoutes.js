import express from "express";
import UserController from "../controller/UserController.js";
import verifyRoles from "../middleware/verifyRoles.js";
import ROLE from "../config/role.js";
const router = express.Router();

router.route("/register").post(UserController.register);
router.route("/").get(UserController.index);

export default router;