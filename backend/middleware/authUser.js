import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {
        // 1. You MUST verify the token first to create the 'token_decode' object
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        
        // 2. We use .id because that's what is stored in your token payload
        req.body.userId = token_decode.id 
        
        // 3. IMPORTANT: You must call next() or the request will hang forever
        next()
    
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser