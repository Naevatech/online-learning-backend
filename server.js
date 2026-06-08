import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import courseRouter from "./routes/courseRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// 1. CORS CONFIG (Must be above routes)
app.use(cors({
    origin: ['http://localhost:4000'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. MIDDLEWARES
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. API ENDPOINTS
app.get("/", (req, res) => res.send("API IS WORKING"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/course", courseRouter);
app.use("/api/admin", adminRouter);

app.listen(port, () => console.log(`Server started on PORT: ${port}`));