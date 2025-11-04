import UserService from "../service/UserService.js";
import ApiResponse from "../utils/ApiResponse.js";
class UserController {
    index(req, res) {
        res.send("User route")
    }

    async register(req, res, next) {
        try {
            const {username, email, password} = req.body;

            const result = await UserService.register(username, email, password);
            
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const result = await UserService.login(email, password);
            return ApiResponse.success(res, result);
        }
        catch(err) {
            next(err);
        }
    }
}

export default new UserController();