import os

def parse_mdl_file(filepath):
    variables = []
    connections = []

    with open(filepath, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    for line in lines:
        parts = line.strip().split(',')
        if line.startswith('10,'):  # Variable
            vid = f"v{parts[1]}"
            variables.append({
                "id": vid,
                "name": parts[2],
                "type": "auxiliary",
                "x": int(parts[3]),
                "y": int(parts[4])
            })

        elif line.startswith('1,'):  # Connection
            from_id = f"v{parts[2]}"
            to_id = f"v{parts[3]}"
            cid = f"c{parts[1]}"
            connections.append({
                "id": cid,
                "from": from_id,
                "to": to_id,
                "polarity": "positive"
            })

    return {
        "name": os.path.basename(filepath),
        "variables": variables,
        "connections": connections
    }


def format_model_key(filename):
    name = filename.replace('.mdl', '').replace('-', ' ')
    name = name.replace('causal', '').strip()
    return name.title()





'''
def parse_all_models_from_folder(folder_path):
    models = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.mdl'):
            path = os.path.join(folder_path, filename)
            models.append(parse_mdl_file(path))
    return models
'''