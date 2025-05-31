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
const port = process.env.PORT || 4000;
const allowedOrigin = ['http://localhost:5173']
connectDB()

app.use(express.json({ limit: '50mb'}));
app.use(cookieParser());
app.use(cors({origin:allowedOrigin, credentials:true}))

// app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
//API ENDPOINT
app.get("/", (req, res)=>res.send("API IS now WORKING"))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)

app.use("/api/admin", adminRouter)
app.listen(port, ()=>console.log(`server started on PORT:${port}`))