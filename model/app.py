from flask import Flask, request, jsonify
import tensorflow as tf
from flask_cors import CORS
from utils import preprocess_image, predict_image
from transformers import FlavaProcessor, FlavaModel
import torch.nn as nn
import os
import torch
import keras
app = Flask(__name__)
# Enable CORS for the frontend origin
CORS(app, resources={r"/predict": {"origins": "http://localhost:8080"}})
ORAL_MODEL_PATH = "oral_fixed.h5"
BREAST_MODEL_PATH = "breast.pth"
# SKIN_MODEL_PATH = "skin.h5"
MRI_MODEL = "new_mrimodel.h5"
X_RAY_MODEL = "x_ray.h5"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


# Load TensorFlow model for oral cancer
try:
    oral_model = tf.keras.models.load_model(ORAL_MODEL_PATH)
    print("Oral cancer model loaded successfully")
except Exception as e:
    print(f"Error loading oral cancer model: {e}")
    exit(1)

# Load PyTorch model for breast cancer
try:
    model_name = "facebook/flava-full"
    processor = FlavaProcessor.from_pretrained(model_name)
    flava_model = FlavaModel.from_pretrained(model_name).to(DEVICE)

    class FlavaClassifier(nn.Module):
        def __init__(self, model, num_classes=2):
            super(FlavaClassifier, self).__init__()
            self.flava = model
            self.classifier = nn.Linear(768, num_classes)

        def forward(self, pixel_values):
            outputs = self.flava(pixel_values=pixel_values)
            image_embedding = outputs.image_embeddings[:, 0, :]
            logits = self.classifier(image_embedding)
            return logits

    breast_model = FlavaClassifier(flava_model, num_classes=2).to(DEVICE)
    breast_model.load_state_dict(torch.load(BREAST_MODEL_PATH, map_location=DEVICE))
    breast_model.eval()
    print("Breast cancer model loaded successfully")
except Exception as e:
    print(f"Error loading breast cancer model: {e}")
    exit(1)

# # Load TensorFlow model for skin cancer
# try:
#     skin_model = tf.keras.models.load_model(SKIN_MODEL_PATH)
#     print("Skin cancer model loaded successfully")
# except Exception as e:
#     print(f"Error loading skin cancer model: {e}")
#     exit(1)

# Load TensorFlow model for MRI
try:
    mri_model = tf.keras.models.load_model(MRI_MODEL)
    print("MRI model loaded successfully")
except Exception as e:
    print(f"Error loading skin cancer model: {e}")
    exit(1)

try:
    xray_model = tf.keras.models.load_model(X_RAY_MODEL)
    print("XRAY model loaded successfully")
except Exception as e:
    print(f"Error loading skin cancer model: {e}")
    exit(1)

# Store models
MODELS = {
    "oral": {"type": "tensorflow", "model": oral_model},
    "breast": {"type": "pytorch", "model": breast_model},
    # "skin": {"type": "tensorflow", "model": skin_model},
    "brain": {"type": "tensorflow", "model": mri_model},
    "chest":  {"type": "tensorflow", "model": xray_model},
}


@app.route('/predict', methods=['POST'])
def predict():
   if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
   if 'type' not in request.form:
        return jsonify({"error": "No cancer type provided"}), 400
   image_file = request.files['image']
   cancer_type = request.form['type'].lower()
   
   if cancer_type not in MODELS:
        return jsonify({"error": f"Model for {cancer_type} is not available"}), 400
   try:
        # Preprocess and predict
        image_array = preprocess_image(image_file, cancer_type=cancer_type)
        result = predict_image(MODELS[cancer_type]["model"], image_array, cancer_type=cancer_type)
        return jsonify(result)
   except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)