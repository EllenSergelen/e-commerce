import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js"; // ✨ Swapped Astra with your Mongoose User Model

// Helper function updated to include role in payload and expiration configuration
const createToken = (id, role = 'customer') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ==========================================
// 1. ROUTE FOR USER LOGIN (Customers)
// ==========================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // ✨ Query MongoDB via Mongoose model instead of Astra DB
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        // Compare incoming plain-text credentials against the hashed password string stored in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Pass the user's actual role from the database
            const token = createToken(user._id, user.role || 'customer');
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// ==========================================
// 2. ROUTE FOR USER REGISTRATION (Customers)
// ==========================================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // ✨ Check if user already exists in MongoDB
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // Validating email format & strong password parameters
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
        }

        // Hashing user password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare document payload structure with your uniform string-based key format
        const userData = {
            _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, 
            name,
            email,
            password: hashedPassword,
            role: 'customer', // Default role matching your frontend auth logic
            date: Date.now()
        };

        // ✨ Insert document cleanly into MongoDB collection via Mongoose .create()
        await userModel.create(userData);

        const token = createToken(userData._id, userData.role);
        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// ==========================================
// 3. ROUTE FOR ADMIN LOGIN USING ENV VARIABLES
// ==========================================
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Securely compare input credentials straight against your Environment setup
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            // Create a secure token with an explicit admin identifier payload
            const token = createToken("admin_dashboard_session", "admin");
            return res.json({ success: true, token });
            
        } else {
            return res.json({ success: false, message: "Invalid admin credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin };