import express from 'express'
import userAuth from '../middleware/userAuth.js'
import { getUserData, getAllCourseEnrolled, startCourse } from '../controllers/userController.js'
const userRouter = express.Router()

userRouter.get("/data", userAuth, getUserData)
userRouter.get("/enrolledCourses", userAuth, getAllCourseEnrolled)
userRouter.post("/startlearning/:courseId", userAuth, startCourse)

export default userRouter