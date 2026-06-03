/// <reference types="vite/client" />

// 1. IMAGE SERVICE: Орон нутгийн Python FastAPI (Port 8000) руу зураг илгээнэ
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
        // Python-оос шууд {"success": true, "data": [...]} ирэх тул бүтнээр нь буцаана
        return result; 
    } catch (err) {
        console.error("Connection to AI failed:", err);
        throw new Error("Манай Python AI сервер 8000 порт дээр ажиллаж байгаа эсэхийг шалгана уу.");
    }
};

// 2. NEW PYTHON TEXT SERVICE: Орон нутгийн Python FastAPI (Port 8000) руу текст илгээнэ
export const callFashionBuddyText = async (inputValue: string): Promise<any> => {
    const PYTHON_AI_TEXT_URL = "http://127.0.0.1:8000/recommend/text"; 
    
    try {
        const response = await fetch(PYTHON_AI_TEXT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: inputValue })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Python Server Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        
        // ✨ ШИЙДЭЛ: Results.tsx бүрэн уншиж чаддаг байхын тулд 
        // Python-оос ирсэн бүтэн хариуг (success болон data-тай нь цуг) буцаана!
        return result;
        
    } catch (err) {
        console.error("Connection to Python AI Text Service failed:", err);
        throw new Error("Манай Python AI сервер 8000 порт дээр ажиллаж байгаа эсэхийг шалгана уу.");
    }
};