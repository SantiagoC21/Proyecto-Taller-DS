import os
import pysd
import json

def controllerSimulation (model_name: str, overrides: dict):
    base_dir = os.path.abspath(
        os.path.join(__file__,'..','..','..','static','vensim','forrester')
    )
    model_path = os.path.join(base_dir, model_name)
    print("Buscando el archivo: " + model_path)
    print("📥 Parámetros recibidos:", overrides)

    model = pysd.read_vensim(model_path)

    if overrides:
        print("▶️ Ejecutando simulación con parámetros...")
        df = model.run(params = overrides)
    else:
        print("▶️ Ejecutando simulación sin parámetros...")
        df = model.run()
    
    print("📊 Resultado (primeros datos):")
    print(df.head(10).to_string())

    result_dict = df.to_dict(orient = 'list')
    print("📤 Diccionario devuelto al frontend:")
    print(json.dumps(result_dict, indent=2))

    return df.to_dict(orient = 'list')
