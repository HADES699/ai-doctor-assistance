import tensorflow as tf
from PIL import Image
import numpy as np
try:
    import pydicom
except ImportError:
    pydicom = None
import torch
from torchvision import transforms


# Define transforms for breast cancer (PyTorch)
BREAST_TRANSFORMS = transforms.Compose([
    transforms.Resize((224, 224)),  # Adjust size based on your model
    transforms.ToTensor(),  # Convert to tensor and normalize to [0, 1]
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])  # ImageNet normalization
])

def preprocess_image(image_file, cancer_type="oral"):
    """
    Preprocess the image based on cancer type.
    Args:
        image_file: File object from Flask request
        cancer_type: 'oral', 'breast', or 'skin'
    Returns:
        Preprocessed image array/tensor ready for model input
    """
    try:
        if cancer_type == "breast" and image_file.mimetype == "image/dicom":
            if not pydicom:
                raise Exception("DICOM support requires pydicom")
            dicom = pydicom.dcmread(image_file)
            image = dicom.pixel_array
            image = ((image - image.min()) / (image.max() - image.min()) * 255).astype(np.uint8)
            image = Image.fromarray(image).convert("RGB")
        else:
            image = Image.open(image_file).convert("RGB")

        if cancer_type == "oral":
            # Preprocessing for TensorFlow models (oral and skin)
            image = image.resize((224, 224), Image.LANCZOS)  # Adjust size as needed
            image_array = np.array(image) / 255.0  # Normalize to [0, 1]
            image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
            return image_array
        # elif cancer_type == "skin":
        #      # Preprocessing for TensorFlow models (oral and skin)
        #     image = image.resize((128, 128), Image.LANCZOS)  # Adjust size as needed
        #     image_array = np.array(image) / 255.0  # Normalize to [0, 1]
        #     image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
        #     return image_array
        elif cancer_type == "breast":
            # Preprocessing for PyTorch breast cancer model
            image_tensor = BREAST_TRANSFORMS(image)
            image_tensor = image_tensor.unsqueeze(0)  # Add batch dimension
            return image_tensor
        elif cancer_type == "brain":
             # Preprocessing for TensorFlow models (oral and skin)
            image = image.resize((128, 128), Image.LANCZOS)  # Adjust size as needed
            image_array = np.array(image) / 255.0  # Normalize to [0, 1]
            image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
            return image_array
        elif cancer_type == "chest":
             # Preprocessing for TensorFlow models (oral and skin)
            image = image.resize((224, 224), Image.LANCZOS)  # Adjust size as needed
            image_array = np.array(image) / 255.0  # Normalize to [0, 1]
            image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
            return image_array
        else:
            raise Exception(f"Unsupported cancer type: {cancer_type}")
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def predict_image(model, image_array, cancer_type="oral"):
    """
    Predict using the provided model.
    Args:
        model: Loaded TensorFlow or PyTorch model
        image_array: Preprocessed image array/tensor
        cancer_type: 'oral', 'breast', or 'skin'
    Returns:
        Dictionary with class_label and confidence
    """
    try:
        if cancer_type == "oral":
            # TensorFlow oral cancer prediction
            predictions = model.predict(image_array)
            confidence = float(predictions[0][1])  # Assuming binary classification
            class_label = "Oral Cancer" if confidence > 0.5 else "Normal"
        # elif cancer_type == "skin":
        #     # TensorFlow skin cancer prediction
        #     predictions = model.predict(image_array)
        #     print(predictions)
        #     confidence = float(predictions[0][0])  # Assuming binary classification
        #     print(confidence)
        #     class_label = "Skin Cancer" if confidence > 0.5 else "Normal"
        elif cancer_type == "brain":
            # Make a prediction
         predictions = model.predict(image_array)
         print(predictions)
         predicted_class_index = np.argmax(predictions, axis=1)[0]
         confidence = float(np.max(predictions, axis=1)[0])
         class_labels = ['pituitary', 'glioma', 'notumor', 'meningioma']
         class_label = class_labels[predicted_class_index] if class_labels[predicted_class_index]!= 'notumor' else "Normal"
         print(predicted_class_index)

        elif cancer_type == "chest":
             # Make a prediction
         predictions = model.predict(image_array)
         print(predictions)
         confidence = float(predictions[0][0]) 
         print (confidence)
         class_label = "Pneumonia" if confidence > 0.5 else "Normal"
        elif cancer_type == "breast":
            # PyTorch breast cancer prediction
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            image_tensor = image_array.to(device)
            model.to(device)
            with torch.no_grad():
                outputs = model(image_tensor)
                probabilities = torch.softmax(outputs, dim=1)
                confidence, predicted_class = torch.max(probabilities, dim=1)
                confidence = float(confidence.item())
                class_label = "Malignant" if predicted_class.item() == 1 else "Benign"
        else:
            raise Exception(f"Unsupported cancer type: {cancer_type}")

        return {
            "class_label": class_label,
            "confidence": confidence
        }
    except Exception as e:
        raise Exception(f"Error predicting image: {str(e)}")