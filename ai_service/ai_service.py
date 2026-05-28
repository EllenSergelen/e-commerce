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

# Enable CORS so your Express backend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. INITIALIZE GLOBAL MODELS ---
# These load once when you start the server
device = "cuda" if torch.cuda.is_available() else "cpu"
yolo_model = YOLO('yolov8n.pt') 
fclip_model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip").to(device)
fclip_processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")

# Load your local survey data
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
        
        # Filter for fashion items (exclude 'person')
        clothing_items = [b for b in results.boxes if results.names[int(b.cls[0])] != 'person' and b.conf.item() > 0.2]
        
        final_results = []
        
        # B. Fallback to whole image if no specific items found
        if not clothing_items:
            items_to_process = [(None, "ENTIRE OUTFIT")]
        else:
            items_to_process = [(b, results.names[int(b.cls[0])].upper()) for b in clothing_items]

        # C. Vector Matching
        for box, label in items_to_process:
            if box:
                coords = box.xyxy[0].tolist()
                crop = raw_image.crop((coords[0], coords[1], coords[2], coords[3]))
            else:
                crop = raw_image

            # Vectorize
            inputs = fclip_processor(images=crop, return_tensors="pt").to(device)
            with torch.no_grad():
                img_feats = fclip_model.get_image_features(**inputs)
                if not isinstance(img_feats, torch.Tensor): 
                    img_feats = img_feats.pooler_output
                img_feats = img_feats / img_feats.norm(p=2, dim=-1, keepdim=True)
            
            # Search Survey Embeddings
            scores = np.dot(user_embeddings, img_feats.cpu().numpy().T).flatten()
            top_indices = np.argsort(scores)[-3:][::-1]

            matches = []
            for idx in top_indices:
                matches.append({
                    "score": float(scores[idx]),
                    "profile": df_survey.iloc[idx]['style_profile_text']
                })
            
            final_results.append({
                "item": label,
                "top_matches": matches
            })

        return {"success": True, "data": final_results}

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)