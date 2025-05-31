import imageupload from "../config/cloudinary.js";
import courseModel from "../models/courseRegisterModel.js";

export const newCourse = async (req, res) => {
    const { title, description } = req.body
    if (!title || !description) {
        return res.json({ success: false, message: "Missing details" })
    }

    try {
        const existingCourse = await courseModel.findOne({ title })
        if (existingCourse) {
            return res.json({ success: false, message: "Course alreafy exist" })
        }
        const course = new courseModel({ title, description })
        await course.save()
        return res.json({ success: true, message: "Course created successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const uploadImage =  async (req, res)=> {
    await imageupload(req.body.image)
    .then((url)=>res.send(url))
    .catch((err)=>res.status(500).send(err))
}

export const addModules = async (req, res) => {
    const { courseID, topic, url, duration, pictureThumbnail } = req.body;

    const moduleToAdd = {
        topic,
        videos: [
            {
                url,
                duration,
                pictureThumbnail,
            }
        ]
    };

    try {
        const updateCourseModule = await courseModel.findByIdAndUpdate(courseID,
            {$push:{modules:moduleToAdd}},
            {new: true}
        )
        if (updateCourseModule) {
            return res.json({success:true, message:"New Course Added"})
        }
    } catch (error) {
        console.log(error)
    }
    // videoId, topic, url, duration, 
}

export const getCourseCreated = async (req, res) => {
    try {
        const course = await courseModel.find()
        console.log(course)
        // console.log({id:course._id, title:course.title})
        return res.json({success:true,  course})
    } catch (error) {
        console.log(error)
        return res.json({success:false, message:"Error in connection"})
    }
}


//get all course created
