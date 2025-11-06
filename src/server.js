import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import morgan from "morgan";
import {connectDB} from "./config/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB(DB_URI);
router(app);


app.listen(PORT, () => {
    console.log(`Server listen from port http://localhost:${PORT}`)
})