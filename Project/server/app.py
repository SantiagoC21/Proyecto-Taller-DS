import ssl
from flask import Flask
from flask_cors import CORS
from src.Routes.route import modelRoute
from pyngrok import ngrok

app = Flask(__name__)
modelRoute(app)
CORS(app)

if __name__ == "__main__":

    #app.run(host='0.0.0.0', port=5000, debug=True, ssl_context='adhoc')
    app.run()



