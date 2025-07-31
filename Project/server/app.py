import ssl
from flask import Flask
from flask_cors import CORS
from src.Routes.route import modelRoute
from pyngrok import ngrok

app = Flask(__name__)
modelRoute(app)
CORS(app)

if __name__ == "__main__":

    app.run()



