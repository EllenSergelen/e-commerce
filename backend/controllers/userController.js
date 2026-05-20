import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { userCollection } from "../config/astra.js"; // Importing our unified Astra DB instance

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
        
        // Query Astra DB directly for the target user record
        const user = await userCollection.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        // Compare incoming plain-text credentials against the hashed password string stored in Astra
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

        // Check if user already exists in Astra DB
        const exists = await userCollection.findOne({ email });
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

        // Prepare Astra DB user payload structure with explicit default role
        const userData = {
            _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`, // Unified string-based structural key format
            name,
            email,
            password: hashedPassword,
            role: 'customer', // Default role matching your frontend auth logic
            date: Date.now()
        };

        // Insert fresh user document straight into the Astra collection context
        await userCollection.insertOne(userData);

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

        // Securely compare input credentials straight against your Render Environment setup
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