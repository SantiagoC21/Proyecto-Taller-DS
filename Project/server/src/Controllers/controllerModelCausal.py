import os
from src.Utils.mdlParser import parse_mdl_file, format_model_key
import urllib3
from decouple import config

def controllerCausalModel():
    carpeta_destino = 'Project/server/static/vensim/causal'
    causal = {}
    archivos_mdl = [
        'frecuencia-de-mantenimiento-causal.mdl',
        'eficiencia-de-movilidad-causal.mdl',
        'satisfaccion_autoridades-causal.mdl',
        'satisfaccion-usuario-causal.mdl',
        'seguridad-vial-causal.mdl'
    ]

    try:
        os.makedirs(carpeta_destino, exist_ok=True)
        url_base = config('APP_URL_CAUSAL')
        http = urllib3.PoolManager()

        for nombre_archivo in archivos_mdl:
            ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)
            url_modelo = url_base + nombre_archivo
            print(f"[DEBUG] Descargando {url_modelo} → {ruta_archivo}")

            try:
                resp = http.request('GET', url_modelo)
                with open(ruta_archivo, 'wb') as archivo:
                    archivo.write(resp.data)
            except Exception as e:
                return [{'message': f'Error descargando {nombre_archivo}: {str(e)}'}]

        # Parsear los modelos descargados
        for nombre_archivo in archivos_mdl:
            ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)
            try:
                data = parse_mdl_file(ruta_archivo)
                nombre_formateado = format_model_key(nombre_archivo)
                causal[nombre_formateado] = data
            except Exception as e:
                return [{'message': f'Error parseando {nombre_archivo}: {str(e)}'}]

        return causal

    except Exception as e:
        return [{'message': f'Error general: {str(e)}'}]