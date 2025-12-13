import express from 'express';
import CartController from '../controller/CartController.js';
import ROLE from '../config/role.js';
import verifyRoles from '../middleware/verifyRoles.js';
const router = express.Router();

router.route('/').get(verifyRoles(ROLE.USER),CartController.getCart);
router.route('/add').post(verifyRoles(ROLE.USER),CartController.addToCart);
router.route('/update').put(verifyRoles(ROLE.USER),CartController.updateCartItem);
router.route('/remove').delete(verifyRoles(ROLE.USER), CartController.removeFromCart);
router.route('/clear').delete(verifyRoles(ROLE.USER), CartController.clearCart);   

export default router;