import os
from config import Config
from flask import Flask, request, jsonify, render_template
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)
app.config.from_object(Config)

# Obtener el directorio actual del script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Definir la ruta al directorio de las imágenes
model_path = os.path.join(script_dir, 'static', 'modelo', 'modelo_entrenado.h5')
model = load_model(model_path)

# Dimensiones de las imágenes esperadas por el modelo
img_height = 224
img_width = 224

# Ruta para la carpeta de subida de imágenes
UPLOAD_FOLDER = os.path.join(script_dir, 'static', 'img')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configurar la carpeta de las plantillas
template_dir = os.path.join(script_dir, 'templates')
app.template_folder = template_dir

# Definir las clases para la predicción
CLASSES = ['liso', 'ondulado', 'rizado']

# Función para preprocesar la imagen
def preprocess_image(image_path):
    img = image.load_img(image_path, target_size=(img_height, img_width))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0  # Rescalar la imagen
    return img

# Ruta para la página principal
@app.route('/')
def index():
    return render_template('chat.html')

# Ruta para la predicción
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No se encontró ninguna imagen'}), 400

    img = request.files['image']
    
    # Verificar si la imagen tiene una extensión válida
    if img.filename.split('.')[-1] not in ['jpg', 'jpeg', 'png']:
        return jsonify({'error': 'Formato de imagen no válido'}), 400

    # Guardar la imagen subida en el servidor
    img.save(os.path.join(app.config['UPLOAD_FOLDER'], img.filename))

    # Cargar la imagen desde el servidor
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], img.filename)

    # Preprocesar la imagen
    img = preprocess_image(img_path)

    # Realizar la predicción
    prediction = model.predict(img)
    predicted_class = np.argmax(prediction)
    predicted_label = CLASSES[predicted_class]

    return jsonify({'prediction': predicted_label})

if __name__ == "__main__":
    app.run(debug=True)
