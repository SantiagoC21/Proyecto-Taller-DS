import os
import pysd

def controllerSimulation (model_name: str, overrides: dict):
    base_dir = os.path.abspath(
        os.path.join(__file__,'..','..','..','static','vensim','forrester')
    )
    model_path = os.path.join(base_dir, model_name)
    print("Buscando el archivo: " + model_path)

    model = pysd.read_vensim(model_path)

    if overrides:
        df = model.run(params = overrides)
    else:
        df = model.run()
    

    return df.to_dict(orient = 'list')
