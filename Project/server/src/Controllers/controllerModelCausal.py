import os
from src.Utils.mdlParser import parse_all_models_from_folder

def controllerCausalModel():
    folder_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '../../static/vensim/causal/modelos')
    )