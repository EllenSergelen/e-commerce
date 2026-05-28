import axios from 'axios';
import FormData from 'form-data';

export const getFashionRec = async (req, res) => {
    try {
        const imageFile = req.file; // Provided by Multer middleware
        
        if (!imageFile) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        // Create the form to send to Python
        const formData = new FormData();
        formData.append('file', imageFile.buffer, { 
            filename: imageFile.originalname,
            contentType: imageFile.mimetype 
        });

        // HIT THE PYTHON AI SERVICE
        const pythonResponse = await axios.post('http://127.0.0.1:8000/recommend', formData, {
            headers: { ...formData.getHeaders() }
        });

        // Send the AI's "Top Matches" back to your React site
        res.json({ success: true, recommendations: pythonResponse.data.data });

    } catch (error) {
        console.error("AI Bridge Error:", error.message);
        res.status(500).json({ success: false, message: "AI Service is currently offline" });
    }
};