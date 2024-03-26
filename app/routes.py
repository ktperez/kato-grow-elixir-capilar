import spacy
import os
from flask import render_template, request, jsonify
from app.assistants.kato_assistant import KatoAssistant
from app import app

# Carga del modelo de spaCy en español
nlp = spacy.load("es_core_news_sm")
kato_assistant = KatoAssistant()

@app.route('/')
def home():
    return render_template('chat.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.form['user_query']

    # Procesar la consulta del usuario con spaCy
    doc = nlp(user_query)

    # Definir patrones de consulta y respuestas
    query_patterns = {
                "hola": "¡Hola! Soy Kato, ¿En qué puedo ayudarte hoy?",
                "producto": "Tenemos disponible el Elixir Capilar Kato Capilar, ideal para cabello, cejas y barba. ¿Te gustaría conocer más detalles?",
                "si": "El elixir capilar kato es un compuesto de diferentes aceites entre estos encontraras los mejores aceites para el cuidado capilar como lo son: aceite de ricino, jojoba, argan y vitamina E. En este producto encontraras la solucion ideal para cualquier tipo de cabello",
                "Con que frecuencia debo aplicarlo en mi cabello ": "Se recomienda aplicar Kato Capilar de 3 a 5 veces por semana en el cabello.",
                "Cuentas gotas de Kato Capilar debo usar en mi cuero cabelludo": "Debes aplicar un promedio de 20 a 25 gotas en todo el cuero cabelludo para una aplicación efectiva.",
                "Cual es la frecuencia recomendada para aplicar Kato Capilar en la barba": "Se sugiere aplicar Kato Capilar de 3 a 5 veces por semana en la barba.",
                "Cuantas gotas de Kato Capilar debo usar en mi barba": "La cantidad adecuada es un promedio de 7 a 12 gotas en toda la zona de la barba que deseas hidratar.",
                "Como debo aplicar Kato Capilar en mis cejas o pestañas": "Se recomienda aplicar Kato Capilar entre 2 a 3 veces por semana en las cejas o pestañas.",
                "Cual es la forma adecuada de aplicar Kato Capilar en las cejas o pestañas": "Unta la brocha de tu máscara de pestañas con nuestro elixir y cepilla bien las cejas o pestañas para una aplicación uniforme.",
                "Cuales son las precauciones que debo tener al usar Kato Capilar": "Debido a que es un óleo capilar, se recomienda usarlo gradualmente para evitar irritaciones. Comienza con 3 aplicaciones a la semana y aumenta gradualmente.",
                "ingredientes": "Nuestro producto está elaborado con aceites esenciales como argán, jojoba y ricino, dedicados a la hidratación y estimulación del crecimiento capilar.",
                "Que debo hacer si experimento irritación al usar Kato Capilar" : "En caso de irritación, suspende el uso del producto hasta que la irritación desaparezca completamente.",
                "comprar": "Puedes adquirir Kato Capilar en nuestra tienda en línea. ¿Te gustaría conocer más sobre cómo comprarlo?",
                "envio": "Ofrecemos envíos gratuitos para compras superiores a $150COP. ¿Necesitas más información sobre nuestros envíos?",
                "final": "Recuerda mantener tu cabello limpio con productos adecuados, evita el exceso de calor y mantén la hidratación. El Elixir Capilar Kato Capilar es un complemento perfecto para estimular el crecimiento y la salud capilar.",
                "hasta_luego": "¡Espero haber sido de ayuda! ¿Hay algo más en lo que pueda asistirte?"
    }

    # Buscar coincidencias entre la consulta del usuario y los patrones definidos
    for pattern, response in query_patterns.items():
        if pattern in user_query.lower():
            return jsonify({'response': response})

    # Si no se encuentra una coincidencia, usar la respuesta predeterminada del asistente
    response = kato_assistant.get_response(user_query)
    return jsonify({'response': response})

# Ruta para manejar la subida de imágenes
@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({'response': "No se ha seleccionado ninguna imagen."})

    image = request.files['image']
    if image.filename == '':
        return jsonify({'response': "No se ha seleccionado ninguna imagen."})

    # Lógica para procesar la imagen, validar y guardar en un directorio
    # Ejemplo básico de validación de extensión (puedes expandir esto)
    allowed_extensions = {'png', 'jpg', 'jpeg'}
    if '.' not in image.filename or image.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
        return jsonify({'response': "Formato de imagen no válido. Por favor, utiliza archivos PNG, JPG o JPEG."})

    # Lógica para guardar la imagen en un directorio
    # Aquí puedes usar librerías como PIL para procesamiento adicional si es necesario

    return jsonify({'response': "Imagen recibida correctamente."})

if __name__ == '__main__':
    app.run(debug=True)
