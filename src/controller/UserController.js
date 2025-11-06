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
            
            const refreshToken = result.refreshToken;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });

            return ApiResponse.success(res, result.accessToken);
        }
        catch(err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const result = await UserService.login(email, password);
            const refreshToken = result.refreshToken;

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
            });

            return ApiResponse.success(res, result.accessToken);
        }
        catch(err) {
            next(err);
        }
    }

    async refresh(req, res, next) {
        try{
            const { refreshToken } = req.cookies;
            const accessToken = await UserService.refresh(refreshToken);
            
            return ApiResponse.success(res, accessToken);
        }
        catch(err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) 
                return res.sendStatus(204);
            
            const isLogout = await UserService.logout(refreshToken);
            res.clearCookie("refreshToken");

            if (isLogout)
                return ApiResponse.success(res,"Logged out successfully");
        }
        catch(err) {
            next(err);
        }
    }
}

export default new UserController();