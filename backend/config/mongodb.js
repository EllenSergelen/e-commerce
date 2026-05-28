// backend/config/mongodb.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("SUCCESS: MongoDB database connected securely.");
        });

        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from your .env file!");
        }
        
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error("ERROR: MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;