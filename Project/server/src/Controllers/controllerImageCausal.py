import os

image_map = {
    "Eficiencia movilidad": "eficiencia-movilidad-image.png",
    "Frecuencia de mantenimiento": "frecuencia-de-mantenimiento-image.png",
    "Satisfacción de autoridades": "satisfaccion-de-autoridades-image.png",
    "Satisfaccion usuario": "satisfaccion-usuario-causal-image.png",
    "Seguridad vial": "seguridad-vial-image.png"
}

def controllerGetImageCausalUrl (model_id: str):

    normalized = model_id.strip().lower()

    normalized_map = {k.lower(): v for k, v in image_map.items()}

    filename = normalized_map.get(normalized)

    if not filename:
        return "/static/images/causal/default.png"
    
    image_path = os.path.join("static", "images", "causal", filename)
    if os.path.exists(image_path):
        return f"/static/images/causal/{filename}"
    else:
        return "/static/images/causal/default.png"