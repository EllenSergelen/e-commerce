import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js' // ✨ Changed from astra to native MongoDB config
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRouter.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

console.log("Checking Env Variables...");
console.log("Stripe Key exists:", !!process.env.STRIPE_SECRET_KEY);
console.log("Cloudinary Name:", process.env.CLOUDINARY_NAME);
console.log("MongoDB URI exists:", !!process.env.MONGO_URI); // Added log check for your MongoDB string

const app = express()
const port = process.env.PORT || 4000

// Initialize Local and Cloud Infrastructure Connections
connectDB() // ✨ Now safely initializes native MongoDB connection
connectCloudinary()

// --- OPTIMIZED CORS & MIDDLEWARES ---
app.use(express.json())

app.use(cors({
    origin: true, // Echoes back your local frontend port dynamically (e.g., http://localhost:5175)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly handles preflight checks
    allowedHeaders: ["Content-Type", "Authorization", "token"] // Passes your admin tokens safely
}));

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/', (req, res) => {
    res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT : ' + port))