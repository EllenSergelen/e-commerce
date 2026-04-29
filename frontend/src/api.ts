/**
 * src/api.ts
 * API Utility for the Fashion Buddy Project (ROAD <- B Team)
 */

// 1. Helper to get environment variables safely in Vite
const getEnv = (key: string) => (import.meta as any).env[key] || "";

const API_URL = getEnv("VITE_FASHION_BUDDY_TEXT_API_URL");
const API_TOKEN = getEnv("VITE_LANGFLOW_TOKEN");

/**
 * Helper to build headers and avoid 403 errors from placeholder tokens
 */

function getHeaders() {
  // Use x-api-key instead of Authorization: Bearer
  return {
    'Content-Type': 'application/json',
    'x-api-key': API_TOKEN 
  };
}

/**
 * 1. Text Search Function
 */
export async function callFashionBuddyText(message: string): Promise<string> {
  if (!API_URL) throw new Error("VITE_FASHION_BUDDY_TEXT_API_URL is not defined in .env");

  const payload = {
    input_value: message,
    input_type: 'chat',
    output_type: 'chat',
    tweaks: {} 
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // If still 403, it means the token is rejected by the local server
        throw new Error(`Text API Error: ${response.status}`);
    }

    const result = await response.json();
    // Path based on standard Langflow 1.0 schema
    return result.outputs?.[0]?.outputs?.[0]?.results?.message?.text || "No results found.";
  } catch (error) {
    console.error("Text search failed:", error);
    throw error;
  }
}

/**
 * 2. Image Search Function
 * (Matches the export name required by ImageUpload.tsx)
 */
export const callFashionBuddyImages = async ({ imageFile }: { imageFile: File }) => {
  // 1. Convert the file to Base64 inside the API utility
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(imageFile);
  });

  const FLOW_ID = "140316f6-8aa9-4116-a3c1-745fd6e63456";
  const API_KEY = "sk-6G_820udTdZp1jVrhYJrUjjurKKp1CaTPnoKjb5sZF0";

  const response = await fetch(`http://127.0.0.1:7860/api/v1/run/${FLOW_ID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      input_value: "Analyze this image and recommend similar items.",
      input_type: "chat",
      output_type: "chat",
      tweaks: {
        // !!! DOUBLE CHECK THIS ID IN LANGFLOW !!!
        "ChatInput-8Vf2Q": { 
          "files": base64 
        }
      }
    })
  });

  if (!response.ok) throw new Error("Langflow connection failed");

  const data = await response.json();
  // Return the text results to be handled by ImageUpload.tsx
  return data.outputs[0].outputs[0].results.message.text;
};