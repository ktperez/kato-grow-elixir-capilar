from flask import Flask

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True  # Para recargar automáticamente las plantillas en modo desarrollo

from app import routes  # Importar las rutas después de crear la aplicación Flask

if __name__ == '__main__':
    app.run()
