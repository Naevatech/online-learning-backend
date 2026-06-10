import imageupload from "../config/cloudinary.js";
import courseModel from "../models/courseRegisterModel.js";
import Stripe from "stripe";
import userModel from "../models/userModel.js";
import userAuth from "../middleware/userAuth.js";

const getStripe = () => {
    const stripeSecretKey = process.env.STRIPE_KEY || process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
        throw new Error("Missing Stripe secret key. Set STRIPE_KEY or STRIPE_SECRET_KEY in your environment.");
    }

    return new Stripe(stripeSecretKey);
};


export const newCourse = async (req, res) => {
    const { title, description, pictureThumbnail, price } = req.body
    if (!title || !description || !pictureThumbnail || price === undefined) {
        return res.json({ success: false, message: "Missing details" })
    }

    try {
        const existingCourse = await courseModel.findOne({ title })
        if (existingCourse) {
            return res.json({ success: false, message: "Course alreafy exist" })
        }
        const course = new courseModel({ title, description, pictureThumbnail, price })
        await course.save()
        return res.json({ success: true, message: "Course created successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const uploadImage = async (req, res) => {
    await imageupload(req.body.image)
        .then((url) => res.send(url))
        .catch((err) => res.status(500).send(err))
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
            { $push: { modules: moduleToAdd } },
            { new: true }
        )
        if (updateCourseModule) {
            return res.json({ success: true, message: "New Course Added" })
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
        return res.json({ success: true, course })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error in connection" })
    }
}


export const getSingleCourse = async (req, res) => {
    const { _id } = req.params;
    try {
        const course = await courseModel.findById(_id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        return res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

export const checkout = async (req, res) => {
    const { name, amount, courseId, userId } = req.body;
    console.log("Checkout request received with data:", { name, amount, courseId, userId });

    try {
        const stripe = getStripe();
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // --- NEW: Check if the course already exists in user's database ---
        // Assuming courseData stores the _id of the course
        const isAlreadyEnrolled = user.enrolledCourses.some(
            (enrollment) => enrollment.courseData._id.toString() === courseId
        );

        if (isAlreadyEnrolled) {
            console.log("User already enrolled in this course");
            return res.json({
                success: true,
                message: "Course already enrolled"
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: name, // Dynamic name
                        },
                        // Convert dollars to cents (e.g., 50 * 100 = 5000)
                        unit_amount: amount * 100,
                    },
                    quantity: 1
                }
            ],
            mode: "payment",
            // success_url: `${process.env.YOUR_DOMAIN}/success`,
            success_url: `${process.env.YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
            cancel_url: `${process.env.YOUR_DOMAIN}/cancel`
        });

        return res.json({
            success: true,
            url: session.url,
            clientSecret: session.client_secret,
            sessionId: session.id
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}


// export const checkout = async (req, res) => {
//     // 1. Destructure userId along with name, amount, and courseId
//     const { name, amount, courseId, userId } = req.body;

//     try {
//         // 2. CHECK IF COURSE ALREADY EXISTS IN USER DATABASE
//         const user = await userModel.findById(userId);

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         // Check the enrolledCourses array for a matching ID
//         const isAlreadyEnrolled = user.enrolledCourses.some(
//             (enrollment) => enrollment.courseData._id.toString() === courseId
//         );

//         if (isAlreadyEnrolled) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "You are already enrolled in this course." 
//             });
//         }

//         // 3. IF NOT ENROLLED, PROCEED TO STRIPE
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "usd",
//                         product_data: {
//                             name: name,
//                         },
//                         unit_amount: amount * 100,
//                     },
//                     quantity: 1
//                 }
//             ],
//             mode: "payment",
//             // Include userId in metadata so verify-payment can find the user later
//             metadata: {
//                 courseId: courseId,
//                 userId: userId
//             },
//             success_url: `${process.env.YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}&courseId=${courseId}`,
//             cancel_url: `${process.env.YOUR_DOMAIN}/cancel`
//         });

//         // 4. Send ONLY ONE response
//         // Use 'url' for Hosted Checkout or 'clientSecret' for Embedded Checkout
//         res.json({ 
//             success: true,
//             url: session.url, 
//             clientSecret: session.client_secret, 
//             sessionId: session.id 
//         });

//     } catch (error) {
//         console.error("Checkout Error:", error);
//         res.status(500).json({ success: false, error: error.message });
//     }
// }


export const verifyPayment = async (req, res) => {
    const { sessionId, courseId, userId } = req.body;
    console.log("Received data:", { sessionId, courseId, userId });

    try {
        const stripe = getStripe();
        // Retrieve the session from Stripe to check status
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.status === 'complete' && session.payment_status === 'paid') {

            // 1. Fetch the User first to check existing enrollments
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }

            const courseData = await courseModel.findById(courseId);
            if (!courseData) {
                return res.status(404).json({ success: false, message: "Course not found" });
            }

            console.log("Course data retrieved:", courseData);

            // 3. Push the actual JSON object
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        enrolledCourses: {
                            courseData: courseData,
                            dateEnrolled: new Date()
                        }
                    }
                },
                { new: true }
            );

            if (updatedUser) {
                console.log("successfully updated user with course enrollment");
                return res.json({
                    success: true,
                    message: "Course Enrolled Successfully"
                });
            }

        } else {
            return res.status(400).json({
                success: false,
                message: "Payment not verified"
            });
        }
    } catch (error) {
        console.error("Error in verifyPayment:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};