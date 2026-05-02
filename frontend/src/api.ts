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
                resolve(result.split(',')[1]);
            } else {
                reject(new Error("File read failed"));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(imageFile);
    });

    // Mapped to your specific .env names
    // Replace your existing lines with these:
    const API_URL = (import.meta as any).env.VITE_FASHION_BUDDY_IMAGE_API_URL;
    const API_KEY = (import.meta as any).env.VITE_LANGFLOW_TOKEN;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({
            input_value: `Analyze this image for ${gender} fashion.`,
            input_type: "chat",
            output_type: "chat",
            tweaks: {
                "ChatInput-8Vf2Q": { "files": base64Data }
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