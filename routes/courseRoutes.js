import express from "express";
import { addModules, newCourse, getCourseCreated, uploadImage } from "../controllers/courseRegistrationController.js";

const courseRouter = express.Router()
courseRouter.post("/create", newCourse)
courseRouter.post("/add", addModules)
courseRouter.get("/allCourse", getCourseCreated)
courseRouter.post("/uploadImage", uploadImage)

export default courseRouter