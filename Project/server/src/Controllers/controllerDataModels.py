from src.Models.model import getModelAll
import pysd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import urllib3
import os
import mpld3
from decouple import config

def controllerData():
    carpeta_destino = os.path.join(os.path.dirname(__file__), '..', '..', 'static', 'vensim', 'forrester')
    carpeta_destino = os.path.abspath(carpeta_destino)
    nivel = {}
    response = getModelAll()

    archivos_mdl = [
        'frecuencia-de-mantenimiento-forrester.mdl',
        'eficiencia-de-movilidad-forrester.mdl',
        'satisfaccion_autoridades-forrester.mdl',
        'satisfaccion-usuario-forrester.mdl',
        'seguridad-vial-forrester.mdl'
    ]

    if not (isinstance(response, list) and 'message' in response[0]):
        response_format = [{
            "idModel": str(item[0]),
            "nameModel": item[1],
            "idSubmodel": str(item[2]),
            "title": item[3],
            "nameLabelX": item[4],
            "nameLabelY": item[5],
            "position": item[6],
            "nameSubmodel": item[7],
            "nameColor": item[8],
            "nameNivel": item[7],
        } for item in response]

        print("[DEBUG] Diccionarios cargados desde la base de datos:")
        for i, item in enumerate(response_format, start=1):
            print(f"[DEBUG] Diccionario {i}: {item}")

        try:
            if not os.path.isdir(carpeta_destino):
                return [{'message': f'Carpeta destino no encontrada: {carpeta_destino}'}]
            url_base = config('APP_URL_FORRESTER')
            http = urllib3.PoolManager()
            '''
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
            
            for nombre_archivo in archivos_mdl:
                ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)

                try:
                    model = pysd.read_vensim(ruta_archivo)
                except Exception as e:
                    return [{'message': f'Error leyendo el archivo {nombre_archivo}: {str(e)}'}]

                try:
                    stocks = model.run()
                except Exception as e:
                    return [{'message': f'Error ejecutando simulación del archivo {nombre_archivo}: {str(e)}'}]

                for i in response_format:
                    try:
                        if i['nameNivel'] not in stocks.columns:
                            print(f"[DEBUG] Nivel '{i['nameNivel']}' no está en {nombre_archivo}")
                            continue

                        stock_data = stocks[i['nameNivel']].head(10).to_dict()

                        plt.plot(stocks[i['nameNivel']], label=i['nameNivel'],
                                 linewidth=4.0, color=i['nameColor'])
                        plt.title(i['title'], loc='center')
                        plt.ylabel(i['nameLabelY'])
                        plt.xlabel(i['nameLabelX'])
                        plt.grid()
                        plt.legend(loc='center left', facecolor='black',
                                   framealpha=1.0, edgecolor='black',
                                   labelcolor='white')
                        plt_graph = mpld3.fig_to_html(plt.gcf())
                        plt.close()

                        modelo = i['nameModel']
                        submodelo = i['nameSubmodel']

                        if modelo not in nivel:
                            nivel[modelo] = {}

                        nivel[modelo][submodelo] = {
                            'data': stock_data,
                            'graph': plt_graph,
                            'title': i['title'],
                            'ylabel': i['nameLabelY'],
                            'xlabel': i['nameLabelX']
                        }

                        print(f"[DEBUG] Gráfico generado para '{i['nameNivel']}' en {nombre_archivo}")

                    except Exception as e:
                        return [{'message': f"Error graficando variable {i['nameNivel']} desde archivo {nombre_archivo}: {str(e)}"}]
            '''
            for nombre_archivo in archivos_mdl:
                ruta_archivo = os.path.join(carpeta_destino, nombre_archivo)

                # Verificar si el archivo ya está descargado
                if not os.path.exists(ruta_archivo):
                    url_modelo = url_base + nombre_archivo
                    print(f"[DEBUG] Descargando {url_modelo} → {ruta_archivo}")

                    try:
                        resp = http.request('GET', url_modelo)
                        with open(ruta_archivo, 'wb') as archivo:
                            archivo.write(resp.data)
                    except Exception as e:
                        return [{'message': f'Error descargando {nombre_archivo}: {str(e)}'}]
                else:
                    print(f"[DEBUG] Archivo ya existe: {ruta_archivo}, omitiendo descarga")

                # Leer modelo Vensim
                try:
                    model = pysd.read_vensim(ruta_archivo)
                except Exception as e:
                    return [{'message': f'Error leyendo el archivo {nombre_archivo}: {str(e)}'}]

                # Ejecutar simulación
                try:
                    stocks = model.run()
                except Exception as e:
                    return [{'message': f'Error ejecutando simulación del archivo {nombre_archivo}: {str(e)}'}]

                # Generar gráficos y diccionarios
                for i in response_format:
                    try:
                        if i['nameNivel'] not in stocks.columns:
                            print(f"[DEBUG] Nivel '{i['nameNivel']}' no está en {nombre_archivo}")
                            continue

                        stock_data = stocks[i['nameNivel']].head(10).to_dict()

                        plt.plot(stocks[i['nameNivel']], label=i['nameNivel'],
                                linewidth=4.0, color=i['nameColor'])
                        plt.title(i['title'], loc='center')
                        plt.ylabel(i['nameLabelY'])
                        plt.xlabel(i['nameLabelX'])
                        plt.grid()
                        plt.legend(loc='center left', facecolor='black',
                                framealpha=1.0, edgecolor='black',
                                labelcolor='white')
                        plt_graph = mpld3.fig_to_html(plt.gcf())
                        plt.close()

                        modelo = i['nameModel']
                        submodelo = i['nameSubmodel']

                        if modelo not in nivel:
                            nivel[modelo] = {}

                        nivel[modelo][submodelo] = {
                            'data': stock_data,
                            'graph': plt_graph,
                            'title': i['title'],
                            'ylabel': i['nameLabelY'],
                            'xlabel': i['nameLabelX']
                        }

                        print(f"[DEBUG] Gráfico generado para '{i['nameNivel']}' en {nombre_archivo}")

                    except Exception as e:
                        return [{'message': f"Error graficando variable {i['nameNivel']} desde archivo {nombre_archivo}: {str(e)}"}]



            return nivel

        except Exception as e:
            return [{'message': f'Error general en controller: {str(e)}'}]

    else:
        return response
