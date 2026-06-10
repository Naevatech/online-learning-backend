import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import { pathToFileURL } from "url";
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
    origin: ['process.env.YOUR_DOMAIN'], 
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

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url;

if (isDirectRun && !process.env.VERCEL) {
    app.listen(port, () => console.log(`Server started on PORT: ${port}`));
}

export default app;