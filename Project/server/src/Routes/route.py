import json
from flask import Response, request, jsonify
from src.Controllers.controllerDataModels import controllerData
from src.Controllers.controllerModelCausal import controllerCausalModel
from src.Controllers.controllerModelForrester import controllerForresterModel
from src.Controllers.controllerSimulation import controllerSimulation
from src.Controllers.controllerImageCausal import controllerGetImageCausalUrl
from src.Controllers.controllerImageForrester import controllerGetImageForresterUrl

def modelRoute(app):
    @app.route('/data', methods=['GET'])
    def data():
        try:
            resp = controllerData()
        except Exception as e:
            # Capturamos cualquier excepción inesperada aquí
            resp = [{ 'message': str(e) }]
        # Serializamos con default=str para forzar a string
        payload = json.dumps(resp, default=str)
        return Response(payload, mimetype='application/json')

    @app.route('/causal', methods=['GET'])
    def causal():
        try:
            resp = controllerCausalModel()
        except Exception as e:
            resp = [{ 'message': str(e) }]
        payload = json.dumps(resp, default=str)
        return Response(payload, mimetype='application/json')

    @app.route('/forrester', methods=['GET'])
    def forrester():
        try:
            resp = controllerForresterModel()
        except Exception as e:
            resp = [{ 'message': str(e) }]
        payload = json.dumps(resp, default=str)
        return Response(payload, mimetype='application/json')

    @app.route('/simulate', methods=['POST'])
    def simulate():
        try:
            playload = request.get_json()
            model_name = playload.get('model')
            overrides  = playload.get('params', {})

            if not model_name or not isinstance(overrides, dict):
                return Response(
                    json.dumps({'error': 'Falta "model" o "params" mal formado'}),
                    status=400,
                    mimetype='application/json'
                )

            result = controllerSimulation(model_name, overrides)

            print("📤 Enviando al frontend el siguiente resultado JSON:")
            print(json.dumps(result, indent=2, ensure_ascii=False))


            payload = json.dumps(result, default=str)
            return Response(payload, mimetype='application/json')

        except FileNotFoundError:
            return Response(
                json.dumps({'error': f'Modelo "{model_name}" no existe'}),
                status=404,
                mimetype='application/json'
            )
        except Exception as e:
            return Response(
                json.dumps({'error': str(e)}),
                status=500,
                mimetype='application/json'
            )

    @app.route('/get-image-url-causal/<model_id>', methods=['GET'])
    def get_image_url_causal(model_id):
        print(f"🔍 Buscando imagen para: {model_id}")
        try:
            image_url = controllerGetImageCausalUrl(model_id)
            return jsonify({"url": image_url})
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/get-image-url-forrester/<model_id>', methods=['GET'])
    def get_image_url_forrester(model_id):
        print(f"🔍 Buscando imagen para: {model_id}")
        try:
            image_url = controllerGetImageForresterUrl(model_id)
            return jsonify({"url": image_url})
        
        except Exception as e:
            return jsonify({"error": str(e)}), 500

