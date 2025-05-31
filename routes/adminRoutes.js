import express from "express";
import { isAuthenticated, login, logout, register,newCourse,addCourseFiles } from "../controllers/adminController.js";
// import userAuth from "../middleware/userAuth.js";
const adminRouter = express.Router(); 
adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.post("/logout", logout);
adminRouter.post("/createcourse", newCourse)
adminRouter.post("/addfiles", addCourseFiles)
// authRouter.get("/is-auth", userAuth, isAuthenticated)
export default adminRouter 