import validator from "validator";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

// Helper function updated to include role in payload
const createToken = (id, role = 'customer') => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Pass the user's actual role from the database
            const token = createToken(user._id, user.role);
            return res.json({ success: true, token });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

// Route for admin login using Database Role
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Search for user with the specific 'admin' role
        const admin = await userModel.findOne({ email, role: 'admin' });
        
        if (!admin) {
            return res.json({ success: false, message: "Admin account not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            const token = createToken(admin._id, 'admin');
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