import torch
import numpy as np
import pandas as pd
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import io

app = FastAPI()

# Enable CORS so your React frontend can connect seamlessly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. MONGOLIAN TRANSLATION & BYPASS MAPPINGS ---
LABEL_TRANSLATIONS = {
    "ENTIRE OUTFIT": "Нийт бүрдэл",
    "DONUT": "Цэцэгтэй / Хээтэй загвар",  # Fixes the fabric pattern misclassification 🍩
    "CAKE": "Хээтэй загвар",
    "TIE": "Зангиа",
    "SHIRT": "Цамц",
    "PANTS": "Өмд",
    "DRESS": "Даашинз",
    "JACKET": "Хүрэм",
    "SHOES": "Гутал",
    "BAG": "Цүнх"
}

STYLE_TRANSLATIONS = {
    "Casual": "Өдөр тутмын чөлөөт",
    "Formal": "Албан ёсны",
    "Vintage": "Винтаж / Хуучны",
    "Streetwear": "Гудамжны загвар",
    "Minimalist": "Минималист / Энгийн"
}

# --- 2. INITIALIZE GLOBAL MODELS ---
device = "cuda" if torch.cuda.is_available() else "cpu"
yolo_model = YOLO('yolov8n.pt') 
fclip_model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip").to(device)
fclip_processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")

# Load data matrices
user_embeddings = np.load("user_style_embeddings.npy")
df_survey = pd.read_csv("processed_user_profiles.csv")

@app.post("/recommend")
async def get_recommendation(file: UploadFile = File(...)):
    try:
        # Read image from request
        img_bytes = await file.read()
        raw_image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        
        # A. YOLO Object Detection
        results = yolo_model(raw_image, verbose=False)[0]
        
        # Filter out non-fashion boxes
        clothing_items = [b for b in results.boxes if results.names[int(b.cls[0])] != 'person' and b.conf.item() > 0.2]
        
        final_results = []
        
        # B. Fallback Router
        if not clothing_items:
            items_to_process = [(None, "ENTIRE OUTFIT")]
        else:
            items_to_process = [(b, results.names[int(b.cls[0])].upper()) for b in clothing_items]

        # C. Feature Extraction & Translation Loop
        for box, label in items_to_process:
            if box:
                coords = box.xyxy[0].tolist()
                crop = raw_image.crop((coords[0], coords[1], coords[2], coords[3]))
            else:
                crop = raw_image

            # Compute Vector Embeddings
            inputs = fclip_processor(images=crop, return_tensors="pt").to(device)
            with torch.no_grad():
                img_feats = fclip_model.get_image_features(**inputs)
                img_feats = img_feats / img_feats.norm(p=2, dim=-1, keepdim=True)
            
            # Matrix Dot Product for similarity scores
            scores = np.dot(user_embeddings, img_feats.cpu().numpy().T).flatten()
            top_indices = np.argsort(scores)[-3:][::-1]

            matches = []
            for idx in top_indices:
                raw_profile = str(df_survey.iloc[idx]['style_profile_text'])
                
                # Clean up empty 'nan' database values safely
                if "nan " in raw_profile or " nan" in raw_profile or raw_profile == "nan":
                    raw_profile = raw_profile.replace("nan", "гоёмсог")

                # Parse and translate target fashion styles
                translated_profile = raw_profile
                for eng, mon in STYLE_TRANSLATIONS.items():
                    if eng.lower() in raw_profile.lower():
                        translated_profile = translated_profile.replace(eng, mon)
                
                # Transform prose descriptions into natural Mongolian
                translated_profile = translated_profile.replace("A Female in the 18–24 age group who prefers", "18–24 насны эмэгтэй,")
                translated_profile = translated_profile.replace("A Male in the 18–24 age group who prefers", "18–24 насны эрэгтэй,")
                translated_profile = translated_profile.replace("clothing in Mixed or patterned.", "хувцаслалтыг сонирхдог хэрэглэгч.")
                translated_profile = translated_profile.replace("clothing in Solid colors.", "нэг өнгийн хувцаслалтыг сонирхдог.")

                matches.append({
                    "score": float(scores[idx]),
                    "profile": translated_profile
                })
            
            # Translate the final object label header
            mon_label = LABEL_TRANSLATIONS.get(label, label)

            final_results.append({
                "item": mon_label,
                "top_matches": matches
            })

        return {"success": True, "data": final_results}

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)