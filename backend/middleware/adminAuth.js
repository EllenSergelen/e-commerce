import jwt from 'jsonwebtoken'

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }

        // 1. Verify the token using your secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 2. Check the role stored in the token payload
        // This must match the role you assigned in your updated login controller
        if (decoded.role !== 'admin') {
            return res.json({ success: false, message: "Not Authorized, Login Again" })
        }

        // Attach decoded info to request for use in later controllers if needed
        req.user = decoded;
        
        next() 
        
    } catch (error) {
        console.log(error) 
        return res.json({ success: false, message: "Session expired or invalid token" })
    }
}

export default adminAuth