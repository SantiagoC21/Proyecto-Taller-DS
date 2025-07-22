'''

from flask import render_template,make_response
from src.Controllers.controller import controller

def modelRoute(app):
    @app.route('/', methods=['GET'])
    def model():
        response = controller()
        if not (isinstance(response, dict) and len(response) == 0):
            if not (isinstance(response, list) and 'message' in response[0]):
                respuesta = make_response(render_template('template.html', nivel=response))
                respuesta.headers['Cache-Control'] = 'public, max-age=180'
                respuesta.headers['X-Content-Type-Options'] = 'nosniff'
                respuesta.headers['Server'] = 'Nombre del servidor'
                return respuesta
            else:
                respuesta = make_response(render_template('error.html', error_message=response))
                return respuesta
        else:
            respuesta = make_response(render_template('error.html', error_message=response))
            return respuesta
        
'''
from flask import jsonify, request

from src.Controllers.controllerDataModels import controllerData
from src.Controllers.controllerModelCausal import controllerCausalModel
from src.Controllers.controllerModelForrester import controllerForresterModel
from src.Controllers.controllerSimulation import controllerSimulation


def modelRoute(app):
    @app.route('/data', methods=['GET'])
    def data():
        response = controllerData()
        return jsonify(response)
    
    @app.route('/causal', methods=['GET'])
    def causal():
        response = controllerCausalModel()
        return jsonify(response)
    
    @app.route('/forrester', methods=['GET'])
    def forrester():
        response = controllerForresterModel()
        return jsonify(response)
    @app.route('/simulate', methods=['POST'])
    def simulate():
        playload = request.get_json()
        model_name = playload.get('model')
        overrides = playload.get('params', {})

        if not model_name or not isinstance(overrides, dict):
            return jsonify({'error': 'Falta "model" o "params" mal formado'}), 400
        
        try:
            result = controllerSimulation(model_name, overrides)
            return jsonify(result)
        except FileNotFoundError:
            return jsonify({'error': f'Modelo "{model_name}" no existe'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    


