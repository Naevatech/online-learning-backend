import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import adminModel from "../models/adminModel.js"
import transporter from "../config/nodemailer.js"
import userAuth from "../middleware/userAuth.js";
import mongoose from 'mongoose';
// name, email, username, gender, password
export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {
        const existingUser = await adminModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new adminModel({ name, email, password: hashedPassword })
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //Send email
        const mailOptions = {
            from: `"Qwdrant.io" ${process.env.SENDER_EMAIL}`,
            to: email,
            subject: "Welcome to your online course creation",
            html: `<div>
                        <h1 style="background-color: rgb(11, 66, 156); color: white;">Welcome</h1>
                        <p>Welcome to my app built. Your account has been created with email id" ${email}</p>
                    </div>`
        }

        try {
            await transporter.sendMail(mailOptions);
        } catch (err) {
            console.error("Error sending email:", err);
        }
        // await transporter.sendMail(mailOptions);
        // try {
        // } catch (error) {
        //     return res.json({success:true, message:error.message})
        // }

        return res.json({ success: true, message: "user succesfully registered" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body
    console.log("I'm working")
    if (!email || !password) {
        return res.json({ success: false, message: "Email and password are required" })
    }

    try {
        const user = await adminModel.findOne({ email })
        // const user1 = await userModel.find()
        // console.log(user1)
        if (!user) {
            return res.json({ success: false, message: "Invalid email" })
        }

        const IsMatch = await bcrypt.compare(password, user.password);
        if (!IsMatch) {
            return res.json({ success: false, message: "Invalid Password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })



    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}



export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : "strict",
        })

        return res.json({ success: true, message: "user logged out" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Not gotten yet
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.json({ success: false, message: "There is an error" })
    }
}

export const uploadImage = async (req, res) => {
    await imageupload(req.body.image)
        .then((url) => res.send(url))
        .catch((err) => res.status(500).send(err))
}


export const newCourse = async (req, res) => {
    const { title, description, courseHour, no_of_files, backdropURL } = req.body
    const _id = new mongoose.Types.ObjectId();
    const newCourse1 = {
        _id,
        title,
        description,
        courseHour,
        no_of_files,
        backdropURL,
        videos: [],

    };

    try {
        const newCourseourse = await adminModel.findByIdAndUpdate("68381d1aaf39fe6c8e9c7c54",
            { $push: { course: newCourse1 } },
            { new: true }
        )
        if (newCourseourse) {
            return res.json({ success: true, message: "New Course added successfully" })
        }

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// export const addCourseFiles = async (req, res) => {
//     const { moduleTitle, videoUrl, assetDownloadURL } = req.body
//     const courseFiles = {
//         moduleTitle,
//         videoUrl,
//         assetDownloadURL    
//     };

//     try {
//         const updateCourseFile = await adminModel.findOneAndUpdate(
//             {
//                 _id: "68381d1aaf39fe6c8e9c7c54",
//                 "course._id": "68382ac13b175046247376e0"
//             },
//             {$push:{"course.$.videos":courseFiles}}, 
//             {new:true}
//         )
//         if(updateCourseFile){
//             return res.json({success:true, message:"New Course updated successfully"})
//         }



//     } catch (error) {
//         return res.json({ success: false, message: error.message })
//     }
// }


export const addCourseFiles = async (req, res) => {
    const { moduleTitle, videoUrl, assetDownloadURL } = req.body;

    const courseFiles = {
        moduleTitle,
        videoUrl,
        assetDownloadURL
    };

    try {
        const admin = await adminModel.findById("68381d1aaf39fe6c8e9c7c54");
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }

        // Find the course by courseId inside admin.course
        const targetCourse = admin.course.find(course =>
            course._id.toString() === "6838550ce06a1eda3abb212e"
            // course._id.equals("68384c2d5f8e374be6ac06da")
        );


        if (!targetCourse) {
            return res.json({ success: false, message: "Course not found" });
        }

        console.log(targetCourse.videos)
        // Push new file into videos array
        targetCourse.videos.push(courseFiles);

        // Manually mark course array as modified so Mongoose knows to save it
        admin.markModified("course");
        // Save the updated document
        console.log("Before save:", JSON.stringify(admin, null, 2));
        await admin.save();

        return res.json({ success: true, message: "Course file added successfully", data: targetCourse });

    } catch (error) {
        console.error("Error saving course file:", error);
        return res.json({ success: false, message: error.message });
    }
};

//get each course created by id
export const getSingleCourse = async (req, res) => {
    const { courseID } = req.params;
    try {
        const admin = await adminModel.findById("courseID");
        if (!admin) {
            return res.json({ success: false, message: "Admin not found" });
        }
        const targetCourse = admin.course.find(course => course._id.toString() === courseID);
        if (!targetCourse) {
            return res.json({ success: false, message: "Course not found" });
        }

        return res.json({ success: true, course: targetCourse });
    } catch (error) {
        console.error("Error fetching single course:", error);
        return res.json({ success: false, message: error.message });
    }
};
