import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import morgan from "morgan";
import {connectDB} from "./config/db.js";
import {init} from "./config/init.js";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

app.use(morgan("combined"));

const allowedOrigins = [
    "http://localhost:5173",
    "https://ecommerce-peach-rho-26.vercel.app",
    "https://www.your-official-domain.com"
];

app.use(cors({
    origin: function (origin, callback) {
        // Cho phép các request không có origin (như Postman hoặc thiết bị di động)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS không cho phép domain này!'));
        }
    },
    credentials: true
}));

// Tăng giới hạn payload để hỗ trợ upload ảnh base64 (max 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

connectDB(DB_URI);
init();
router(app);


app.listen(PORT, () => {
    console.log(`Server listen from port http://localhost:${PORT}`)
})