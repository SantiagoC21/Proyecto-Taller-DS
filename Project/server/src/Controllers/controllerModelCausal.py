import os
from src.Utils.mdl_parser import parse_all_models_from_folder

def controllerCausalModel():
    folder_path = os.path.abspath(
        os.path.join(os.path.dirname(__file__), '../../static/vensim/causal/modelos')
    )