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
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
}
