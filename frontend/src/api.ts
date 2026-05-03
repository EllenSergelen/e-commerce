export const callFashionBuddyImages = async ({
    imageFile,
    gender = "All"
}: {
    imageFile: File;
    gender?: string;
}): Promise<string> => {

    const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            if (result) {
                // IMPORTANT: Strip the 'data:image/png;base64,' prefix
                resolve(result.split(',')[1]);
            } else {
                reject(new Error("File read failed"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
    });

    const API_URL = (import.meta as any).env.VITE_FASHION_BUDDY_IMAGE_API_URL;
    const API_KEY = (import.meta as any).env.VITE_LANGFLOW_TOKEN;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        // Ensure this part of your callFashionBuddyImages matches your actual Langflow setup:
        body: JSON.stringify({
            input_value: "",
            input_type: "chat",
            output_type: "chat",
            tweaks: {
                // If your component ID is different, change 'ChatInput-8Vf2Q' here:
                "ChatInput-akTh7": {
                    "files": base64Data
                },
                "Prompt Template-7Kvxd": { // Optional: ensures variables are targeted
                    "detected_outfit": "",
                    "product_matches": ""
                }
            }
        })
    });

    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return data.outputs[0].outputs[0].results.message.text;
};

export const callFashionBuddyText = async (inputValue: string): Promise<string> => {
    // Mapped to your specific .env names
    // Replace your existing lines with these:
    const API_URL = (import.meta as any).env.VITE_FASHION_BUDDY_TEXT_API_URL;
    const API_KEY = (import.meta as any).env.VITE_LANGFLOW_TOKEN;
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({
            input_value: inputValue,
            input_type: "chat",
            output_type: "chat"
        })
    });

    if (!response.ok) throw new Error("API connection failed");
    const data = await response.json();
    return data.outputs[0].outputs[0].results.message.text;
};