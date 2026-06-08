import express from "express";
import { addModules, newCourse, getCourseCreated, uploadImage, getSingleCourse, checkout, verifyPayment } from "../controllers/courseRegistrationController.js";
import userAuth from "../middleware/userAuth.js";

const courseRouter = express.Router()
courseRouter.post("/create", newCourse)
courseRouter.post("/add", addModules)
courseRouter.get("/allCourse", getCourseCreated)
courseRouter.post("/uploadImage", uploadImage)
courseRouter.get("/mycourse/:_id", getSingleCourse)
courseRouter.post("/checkout", checkout)
courseRouter.post("/verify-payment", verifyPayment)
export default courseRouter