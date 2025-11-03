import mongoose from "mongoose";

export const connectDB = async(MGDB_URI) =>{
    try {
        await mongoose.connect(MGDB_URI);
        console.log("You successfully connected to MongoDB!");
    }
    catch (err) {
        console.log("Cannot connect to db: ", err);
        process.exit(1);
    }
}