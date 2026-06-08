import jwt from "jsonwebtoken";
const userAuth =  async(req, res, next)=> {
    const {token} = req.cookies
    console.log('Token found:', token)
    if (!token) {
        return res.json({
            success:false,
            message:"Not Authorized. Login Again"
        })
    }
    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined in environment variables");
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', tokenDecode)
        if (tokenDecode.id) {
            req.userId = tokenDecode.id
            next();
        } else {
            return res.json({success:false, message:"Not Authorized Login Again"})
        }
        
    } catch (error) {
        return res.json({success:false, message:"error.message"} )
    }
}

export default userAuth