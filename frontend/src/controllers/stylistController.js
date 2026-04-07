import { v2 as cloudinary } from "cloudinary";
import axios from "axios";

const getAiSuggestions = async (req, res) => {
    try {
        const { userId, gender, description } = req.body;
        const imageFile = req.file;
        let inputContent = description || ""; // Default to text description

        // 1. If an image is uploaded, send it to Cloudinary first
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
                resource_type: "image" 
            });
            inputContent = imageUpload.secure_url; // Use URL as the AI input
        }

        if (!inputContent) {
            return res.json({ success: false, message: "Please provide an image or description" });
        }

        // 2. Langflow Configuration
        const FLOW_ID = "YOUR_ACTUAL_FLOW_ID"; // Get this from your Langflow dashboard
        const LANGFLOW_TOKEN = process.env.LANGFLOW_TOKEN; // Your API token in .env
        const langflowUrl = `https://api.langflow.store/v1/run/${FLOW_ID}?api_key=${LANGFLOW_TOKEN}`;

        // 3. Post to Langflow
        const response = await axios.post(langflowUrl, {
            input_value: inputContent,
            input_type: imageFile ? "image" : "chat",
            output_type: "chat",
            tweaks: {
                "TextOutput-xyz": {}, // Add your specific component tweaks here if needed
                "Parameter-gender": gender
            }
        });

        // 4. Extracting the text result
        // Note: Langflow's response structure can be deep; adjust based on your specific flow
        const suggestions = response.data.outputs[0].outputs[0].results.message.text;

        res.json({ 
            success: true, 
            suggestions, 
            imageUrl: imageFile ? inputContent : null 
        });

    } catch (error) {
        console.error("Langflow Error:", error.message);
        res.json({ success: false, message: "AI Stylist is currently resting. Try again soon!" });
    }
};

export { getAiSuggestions };