
import os
import re
'''
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




'''
def parse_all_models_from_folder(folder_path):
    models = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.mdl'):
            path = os.path.join(folder_path, filename)
            models.append(parse_mdl_file(path))
    return models
'''


def parse_mdl_file(filepath):
    variables = []
    connections = []
    variable_ids = set()  # Para evitar duplicados

    with open(filepath, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    for line in lines:
        parts = line.strip().split(',')

        if not parts or len(parts) < 5:
            continue

        prefix = parts[0]

        if prefix in ['10', '11', '12']:  # Variable
            try:
                tipo = {
                    '10': 'auxiliary',
                    '11': 'stock',
                    '12': 'flow'
                }[prefix]

                vid = f"v{parts[1]}"
                name = parts[2].strip('"')

                if name == '0' or name.strip() == '':
                    continue  # Ignorar nombres inválidos

                if vid in variable_ids:
                    continue  # Ignorar duplicados

                x = int(parts[3])
                y = int(parts[4])

                variables.append({
                    "id": vid,
                    "name": name,
                    "type": tipo,
                    "x": x,
                    "y": y
                })

                variable_ids.add(vid)

            except Exception as e:
                print("[ERROR variable] Línea inválida:", line.strip(), "→", e)
                continue

        elif prefix == '1':  # Conexión
            try:
                cid = f"c{parts[1]}"
                from_id = f"v{parts[2]}"
                to_id = f"v{parts[3]}"

                text = line.strip()

                # Extraer color (primer patrón RGB)
                color_match = re.search(r"(\d+-\d+-\d+)", text)
                color = color_match.group(1) if color_match else None

                # Determinar polaridad según color
                if color == "0-0-255":
                    polarity = "positive"
                elif color == "255-0-0":
                    polarity = "negative"
                else:
                    polarity = "positive"

                # Extraer coordenadas de curva
                coord_match = re.search(r"\((\d+),(\d+)\)", text)
                if coord_match:
                    x_curve = int(coord_match.group(1))
                    y_curve = int(coord_match.group(2))
                else:
                    x_curve = None
                    y_curve = None

                connections.append({
                    "id": cid,
                    "from": from_id,
                    "to": to_id,
                    "color": color,
                    "polarity": polarity,
                    "x_curve": x_curve,
                    "y_curve": y_curve
                })

            except Exception as e:
                print("[ERROR conexión] Línea inválida:", line.strip(), "→", e)
                continue

    return {
        "name": os.path.basename(filepath),
        "variables": variables,
        "connections": connections
    }

def format_model_key(filename):
    name = filename.replace('.mdl', '').replace('-', ' ')
    name = name.replace('causal', '').strip()
    return name.title()