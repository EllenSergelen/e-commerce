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
export async function callFashionBuddyImages({ imageFile }: { imageFile: File }): Promise<string> {
  if (!API_URL) throw new Error("VITE_FASHION_BUDDY_TEXT_API_URL is not defined in .env");

  // Convert image to Base64 for the Langflow tweak
  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const payload = {
    input_value: "Analyze this image and find matching items",
    input_type: 'chat',
    output_type: 'chat',
    tweaks: {
      // ⚠️ Check your Langflow UI for the exact ID of your Chat Input node
      "ChatInput-a1b2c": { 
        "files": [base64Image] 
      }
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Image API Server Error:", errorData);
      throw new Error(`Image API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.outputs?.[0]?.outputs?.[0]?.results?.message?.text || "No results found for this image.";
  } catch (error) {
    console.error("Image search failed:", error);
    throw error;
  }
}