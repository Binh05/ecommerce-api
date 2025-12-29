import express from "express";
import UserController from "../controller/UserController.js";
import ROLE from "../config/role.js";
import verifyRoles from "../middleware/verifyRoles.js";
const router = express.Router();

router.route("/").get(verifyRoles(ROLE.ADMIN), UserController.index);

router.route("/me").get(verifyRoles(ROLE.USER, ROLE.ADMIN), UserController.me);
router.route("/me").put(verifyRoles(ROLE.USER, ROLE.ADMIN), UserController.updateMe);
router.route("/me/password").put(verifyRoles(ROLE.USER, ROLE.ADMIN), UserController.changePassword);

router.route("/:id").get(verifyRoles(ROLE.USER, ROLE.ADMIN), UserController.show);
router.route("/:id").put(verifyRoles(ROLE.USER, ROLE.ADMIN), UserController.update);
router.route("/:id").delete(verifyRoles(ROLE.ADMIN), UserController.destroy);

export default router;
