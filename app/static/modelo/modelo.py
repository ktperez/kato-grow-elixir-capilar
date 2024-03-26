import os
from flask import Flask, request, jsonify, render_template
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Obtener el directorio actual del script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Ruta al modelo entrenado
model_path = os.path.join(script_dir, 'static', 'modelo', 'modelo_entrenado.keras')
model = load_model(model_path)

# Ruta de inicio
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para la predicción
@app.route('/predict', methods=['POST'])
def predict():
    # Código para procesar la imagen y obtener la predicción
    return jsonify({'prediction': 'predicted_label'})

if __name__ == "__main__":
    app.run(debug=True)
