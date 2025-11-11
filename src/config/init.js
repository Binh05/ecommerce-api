import User from "../model/User.js";
import ROLE from "./role.js";
import UserService from "../service/UserService.js";

export const init = async() => {
    try {
        const admin = await User.findOne({role: ROLE.ADMIN})
        if (!admin) {
            const newAdmin = await User.create({email: "admin@exclusive", username: "Admin", password: "binhdeptrai", role: ROLE.ADMIN});
            if (newAdmin)
            {
                console.log("New admin has been created with default password, please change password as soon as possible!");
            }
            else{
                console.error("Can not create new admin");
            }
        }

        const user = await User.findOne({role: ROLE.USER})
        if (!user) {
            const newAdmin = await User.create({email: "songoku@example.com", username: "Songoku", password: "12345678", role: ROLE.USER});
            if (newAdmin)
            {
                console.log("New user has been created with default password, please change password as soon as possible!");
            }
            else{
                console.error("Can not create new user");
            }
        }
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}
