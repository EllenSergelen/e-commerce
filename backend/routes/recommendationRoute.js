import axios from 'axios';
import FormData from 'form-data';

const getAIRecommendation = async (req, res) => {
    try {
        const imageFile = req.file; // The image from your React upload form

        // Send the image to your Python AI Microservice
        const formData = new FormData();
        formData.append('file', imageFile.buffer, { filename: imageFile.originalname });

        const response = await axios.post('http://localhost:8000/recommend', formData, {
            headers: formData.getHeaders()
        });

        // Send the matches back to your React website
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ success: false, message: "AI Service Offline" });
    }
};