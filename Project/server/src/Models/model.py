from Connection.connection import connect, connection_select
from src.Models.modelos_info import modelos_info  # Diccionario con estructura lógica

def getModelAll():
    dataBase = connect()
    if not isinstance(dataBase, list):
        cursorObject = dataBase.cursor()
        
        try:
                   
            stmt = """
            SELECT
                m.idModel,
                m.nombre,
                df.idArchivo,
                df.descripcionTabla,
                df.descripcionSimulacion,
                sb.idSubmodel,
                sb.nombre,
                vf.idVariableForrester,
                vf.nombre, 
                vf.titulo, 
                vf.tipo,
                vf.unidad,
                vf.tiempo
            FROM diagramaforrester df
            JOIN model m on df.idModel = m.idModel
            JOIN submodel sb on sb.idForrester = df.idForrester 
            JOIN variableforrester vf on vf.idSubmodel = sb.idSubmodel
            ORDER BY sb.idSubmodel;
            """

            myresult = connection_select(cursorObject, stmt)
            cursorObject.close()
            dataBase.close()
            return myresult
        except Exception as e:
            cursorObject.close()
            dataBase.close()
            return [{'message': f'Error en consulta getModelAll: {str(e)}'}]
    else:
        error_message = dataBase[0]['message']
        return [{'message': error_message}]


def getModeloInfo():
    """
    Retorna el diccionario que define qué variables 
    se deben graficar por modelo y submodelo.
    """
    return modelos_info
