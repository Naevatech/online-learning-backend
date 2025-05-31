import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"
import transporter from "../config/nodemailer.js"
import userAuth from "../middleware/userAuth.js";
// name, email, username, gender, password
export const register = async (req, res) => {
    const { name, email, username, gender, password } = req.body
    if (!name || !email || !username || !gender || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }
    try {
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, username, gender, password: hashedPassword })
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
            from: `"Magic Elves" ${process.env.SENDER_EMAIL}`,
            to: email,
            subject: "Welcome to my app",
            text: `Welcome to my app built. Your account has been created with email id" ${email}`,
            html: `<div>
        <h1 style="background-color: rgb(11, 66, 156); color: white;">Welcome</h1>
        <p>Welcome to my app built. Your account has been created with email id" ${email}</p>
    </div>`
        }

        await transporter.sendMail(mailOptions);
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
        const user = await userModel.findOne({ email })
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

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req;
        console.log("User ID received in sendVerifyOtp:", userId);

        const user = await userModel.findById(userId);
        if (!user) {
            console.log("Error: User not found for ID:", userId);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            console.log("User account already verified:", user.email);
            return res.json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        try {
            await user.save();
            console.log("OTP saved for user:", user.email, "OTP:", otp);
        } catch (saveError) {
            console.error("Error saving OTP to database:", saveError);
            return res.status(500).json({ success: false, message: "Failed to save OTP" });
        }

        // Send email
        const mailOptions = {
            from: `"Magic Elves, " ${process.env.SENDER_EMAIL}`,
            to: user.email,
            subject: "Account verification OTP",
            text: `Welcome to my app built. Verify your account using OTP: ${otp}`,
            html: `<div>
                        <h1 style="background-color: rgb(11, 66, 156); color: white;">Account verification OTP</h1>
                        <p>Verify your account using the following OTP: <strong>${otp}</strong></p>
                    </div>`,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent:", info.response);
            return res.json({ success: true, message: "Verification OTP sent to your email" });
        } catch (mailError) {
            console.error("Error sending email:", mailError);
            return res.status(500).json({ success: false, message: "Failed to send verification email" });
        }

    } catch (error) {
        console.error("General error in sendVerifyOtp:", error);
        return res.status(500).json({ success: false, message: "An unexpected error occurred" });
    }
};

export const verifyEmail = async (req, res) => {
    const {userId} = req
    const {otp} = req.body;

    console.log({"userID":userId, otp})
    console.log(userId)
    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details" })
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }
        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({ sucess: false, message: "invalid OTP" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired" })
        }

        user.isAccountVerified = true
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save()
        return res.json({ sucess: true, message: "email verify successfully" })

    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}

// Not gotten yet
export const isAuthenticated = async(req, res)=> {
    try { 
        return res.json({success:true});
    } catch (error) { 
        return res.json({success:false, message:"There is an error"})
    }
}

//Send password reset OTP
export const sendResetOtp = async(req, res)=> {
    const {email} = req.body;
    if (!email) {
        return res.json({success:false, message:"Email is required"})  
    }

    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success:false, message:"user not found"})
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
        await user.save();

        //Send email
        const mailOptions = {
            from: `"Magic Elves" ${process.env.SENDER_EMAIL}`,
            to: user.email,
            subject: "Your password reset OTP",
            text: `This is a one time OTP reset your password    ${otp}`,
            html: `<div>
                <h1 style="background-color: rgb(11, 66, 156); color: white;">Account verification otp</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. </p>
            </div>`
        }

        await transporter.sendMail(mailOptions);
        return res.json({ success: true, message: "Verification OTP Sent on email" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const resetPassword = async(req, res) => {
    const {email, otp, newPassword} = req.body
    console.log(email)
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "Email, OTP new password are required" })
    }

    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.json({success:false, message:"user not found"})
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: "invalid OTP" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success: false, message: "OTP expired" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();
 
        return res.json({ success: true, message: "Your password has been reset successfullys" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}