import express from "express";
import UserController from "../controller/UserController.js";
const router = express.Router();

router.route("/").get(UserController.index);
router.route("/:id").get(UserController.show);
router.route("/:id").put(UserController.update);
router.route("/:id").delete(UserController.destroy);

export default router;
