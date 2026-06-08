import userModel from "../models/userModel.js";
export const getUserData = async (req, res) => {
    try {
        const {userId} = req
        console.log(userId)
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({success:false, message:"user not found"})
        }
        res.json({
            success:true,
            userData:{
                data:user
            }

        })
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}

export const getAllCourseEnrolled = async (req, res) => {
    try {
        const { userId } = req;
        // 1. Find the specific user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({ 
            success: true, 
            courses: user.enrolledCourses 
        });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error in connection", 
            error: error.message 
        });
    }
}

export const startCourse = async (req, res) => {
    // 1. Get courseId from URL params (recommended for GET requests)
    const { courseId } = req.params; 
    
    try {
        const { userId } = req;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Find the specific course in the enrolled array
        const enrolledCourse = user.enrolledCourses.find(
            (course) => course.courseData._id.toString() === courseId
        );

        // 3. Safety Check: If they aren't enrolled, don't let them in
        if (!enrolledCourse) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not enrolled in this course." 
            });
        }

        return res.json({ 
            success: true, 
            course: enrolledCourse.courseData // Return the inner data
        });

    } catch (error) {
        console.error("Error starting course:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
}