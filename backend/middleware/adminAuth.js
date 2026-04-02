import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }

        // 1. Verify the token using your secret
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // 2. Check if the decoded value matches your Admin Secret String
        // Note: Ensure this matches exactly how you generated the token in your login controller
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }

        next() // Move to the actual controller function
        
    } catch (error) {
        console.log(error) // Fixed: Added .log
        return res.json({ success: false, message: error.message })
    }
}

export default adminAuth