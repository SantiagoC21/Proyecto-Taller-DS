import ssl
from flask import Flask
from flask_cors import CORS
from src.Routes.route import modelRoute
from pyngrok import ngrok
#ssl._create_default_https_context = ssl._create_unverified_context
#ngrok.set_auth_token('2zZzTO54hy2JPoReRPnJO8qz72A_6DzH3M3THNmjPbL7kGkM6')
app = Flask(__name__)
modelRoute(app)
CORS(app)

if __name__ == "__main__":
    #public_url = ngrok.connect(5000)
    # Obtener la URL pública generada por Ngrok
    #public_url_str = str(public_url)
    #print('URL pública de Ngrok:', public_url_str)
    app.run()



