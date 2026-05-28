// 1. IMAGE SERVICE: Points to your LOCAL Python FastAPI (Port 8000)
export const callFashionBuddyImages = async ({
    imageFile,
    gender = "All"
}: {
    imageFile: File;
    gender?: string;
}): Promise<any> => {
    const LOCAL_AI_URL = "http://127.0.0.1:8000/recommend";
    const formData = new FormData();
    formData.append('file', imageFile); 

    try {
        const response = await fetch(LOCAL_AI_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI Service Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        // Return the whole result so Results.tsx can extract item and top_matches
        return result; 
    } catch (err) {
        console.error("Connection to AI failed:", err);
        throw new Error("Make sure your Python AI terminal is running on port 8000.");
    }
};

// 2. NEW MONGODB TEXT SERVICE: Queries your internal Node.js / Express backend
export const callFashionBuddyText = async (inputValue: string): Promise<any> => {
    // Points to your Express backend local development port
    const BACKEND_URL = "http://localhost:5000/api/products/search"; 
    
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // If your app uses administrative or user tokens, attach them here:
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ query: inputValue })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Database Server Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        
        /* To ensure perfect backward compatibility with your working Results.tsx, 
          map your text database results to simulate the same layout structure:
          [{ item: "Text Search", top_matches: [...] }]
        */
        return [{
            item: inputValue.toUpperCase(),
            top_matches: data.products || data
        }];
    } catch (err) {
        console.error("Connection to backend database failed:", err);
        throw new Error("Make sure your Express/Node.js server is running on port 5000.");
    }
};