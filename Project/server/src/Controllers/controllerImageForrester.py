import os

image_map = {
    "Eficiencia movilidad": "eficiencia-de-movilidad-image.png",
    "Frecuencia de mantenimiento": "frecuencia-de-mantenimiento-image.png",
    "Satisfacción de autoridades": "satisfaccion-autoridades-image.png",
    "Satisfaccion usuario": "satisfaccion-usuario-image.png",
    "Seguridad vial": "seguridad-vial-image.png"
}

def controllerGetImageForresterUrl (model_id: str):

    normalized = model_id.strip().lower()

    normalized_map = {k.lower(): v for k, v in image_map.items()}

    filename = normalized_map.get(normalized)

    if not filename:
        return "/static/images/forrester/default.png"
    
    image_path = os.path.join("static", "images", "forrester", filename)
    if os.path.exists(image_path):
        return f"/static/images/forrester/{filename}"
    else:
        return "/static/images/forrester/default.png"