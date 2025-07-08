"""
Python model 'eficiencia-de-movilidad-forrester.py'
Translated using PySD
"""

from pathlib import Path
import numpy as np

from pysd.py_backend.functions import integer, step
from pysd.py_backend.statefuls import Integ
from pysd import Component

__pysd_version__ = "3.14.3"

__data = {"scope": None, "time": lambda: 0}

_root = Path(__file__).parent


component = Component()

#######################################################################
#                          CONTROL VARIABLES                          #
#######################################################################

_control_vars = {
    "initial_time": lambda: 2025,
    "final_time": lambda: 2036,
    "time_step": lambda: 1,
    "saveper": lambda: time_step(),
}


def _init_outer_references(data):
    for key in data:
        __data[key] = data[key]


@component.add(name="Time")
def time():
    """
    Current time of the model.
    """
    return __data["time"]()


@component.add(
    name="FINAL TIME", units="Year", comp_type="Constant", comp_subtype="Normal"
)
def final_time():
    """
    The final time for the simulation.
    """
    return __data["time"].final_time()


@component.add(
    name="INITIAL TIME", units="Year", comp_type="Constant", comp_subtype="Normal"
)
def initial_time():
    """
    The initial time for the simulation.
    """
    return __data["time"].initial_time()


@component.add(
    name="SAVEPER",
    units="Year",
    limits=(0.0, np.nan),
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time_step": 1},
)
def saveper():
    """
    The frequency with which output is stored.
    """
    return __data["time"].saveper()


@component.add(
    name="TIME STEP",
    units="Year",
    limits=(0.0, np.nan),
    comp_type="Constant",
    comp_subtype="Normal",
)
def time_step():
    """
    The time step for the simulation.
    """
    return __data["time"].time_step()


#######################################################################
#                           MODEL VARIABLES                           #
#######################################################################


@component.add(
    name="Calidad de la infraestructura vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"tasa_de_inversion_de_infraestructura": 1},
)
def calidad_de_la_infraestructura_vial():
    return tasa_de_inversion_de_infraestructura() * 50


@component.add(
    name="Calidad de transporte publico",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_vehiculos_de_transporte_publico_en_buen_estado": 1,
        "estres_a_transportistas": 1,
    },
)
def calidad_de_transporte_publico():
    return (
        tasa_de_vehiculos_de_transporte_publico_en_buen_estado()
        * 2500
        / estres_a_transportistas()
    )


@component.add(
    name="Cantidad del transporte informal",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "nivel_de_educacion_vial": 1,
        "politicas_de_regulacion_de_transporte": 1,
    },
)
def cantidad_del_transporte_informal():
    return 4500 / nivel_de_educacion_vial() / politicas_de_regulacion_de_transporte()


@component.add(
    name="Casos que han sido solucionados",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"extorsiones_a_transportistas": 1, "seguridad": 1},
)
def casos_que_han_sido_solucionados():
    return integer(extorsiones_a_transportistas() * seguridad() * 0.5)


@component.add(
    name="Congestion vehicular",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "total_de_vehiculos_en_circulacion": 1,
        "total_de_infracciones": 1,
        "cruce_de_pista_indebidos": 1,
        "paradas_no_autorizadas": 1,
    },
)
def congestion_vehicular():
    return (
        total_de_vehiculos_en_circulacion()
        + total_de_infracciones()
        + cruce_de_pista_indebidos()
        + paradas_no_autorizadas()
    ) / 100


@component.add(
    name="Cruce de pista indebidos",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_transeuntes_que_cruzan_indebidamente": 1,
        "nivel_de_educacion_vial": 1,
    },
)
def cruce_de_pista_indebidos():
    return (
        tasa_de_transeuntes_que_cruzan_indebidamente() * 500 / nivel_de_educacion_vial()
    )


@component.add(
    name="Dificultad de movilidad",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"congestion_vehicular": 1},
)
def dificultad_de_movilidad():
    return congestion_vehicular() * 1


@component.add(
    name="Eficiencia de movilidad",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_eficiencia_de_movilidad": 1},
    other_deps={
        "_integ_eficiencia_de_movilidad": {
            "initial": {},
            "step": {"facilidad_de_movilidad": 1, "dificultad_de_movilidad": 1},
        }
    },
)
def eficiencia_de_movilidad():
    return _integ_eficiencia_de_movilidad()


_integ_eficiencia_de_movilidad = Integ(
    lambda: integer(facilidad_de_movilidad() - dificultad_de_movilidad()),
    lambda: 30,
    "_integ_eficiencia_de_movilidad",
)


@component.add(
    name="Estrategias de ejecucion de obras",
    comp_type="Constant",
    comp_subtype="Normal",
)
def estrategias_de_ejecucion_de_obras():
    return 10


@component.add(
    name="Estres a transportistas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "extorsiones_a_transportistas": 1,
        "tasa_de_presion_de_pasajeros": 1,
        "calidad_de_la_infraestructura_vial": 1,
        "total_de_infracciones": 1,
    },
)
def estres_a_transportistas():
    return (
        extorsiones_a_transportistas()
        * tasa_de_presion_de_pasajeros()
        / calidad_de_la_infraestructura_vial()
        + total_de_infracciones()
    )


@component.add(
    name="Extorsiones a transportistas",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_extorsiones_a_transportistas": 1},
    other_deps={
        "_integ_extorsiones_a_transportistas": {
            "initial": {},
            "step": {
                "transportistas_extorsionados": 1,
                "casos_que_han_sido_solucionados": 1,
            },
        }
    },
)
def extorsiones_a_transportistas():
    return _integ_extorsiones_a_transportistas()


_integ_extorsiones_a_transportistas = Integ(
    lambda: integer(transportistas_extorsionados() - casos_que_han_sido_solucionados()),
    lambda: 325,
    "_integ_extorsiones_a_transportistas",
)


@component.add(
    name="Facilidad de movilidad",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"fluidez_del_trafico": 1},
)
def facilidad_de_movilidad():
    return fluidez_del_trafico()


@component.add(
    name="Fluidez del trafico",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "calidad_de_la_infraestructura_vial": 1,
        "uso_del_transporte_publico": 1,
        "estrategias_de_ejecucion_de_obras": 1,
    },
)
def fluidez_del_trafico():
    return (
        calidad_de_la_infraestructura_vial()
        * uso_del_transporte_publico()
        * estrategias_de_ejecucion_de_obras()
    ) / 86


@component.add(
    name="Infracciones antiguas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"total_de_infracciones": 1},
)
def infracciones_antiguas():
    return integer(total_de_infracciones() * 0.45)


@component.add(
    name="Infracciones nuevas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "total_de_infracciones": 1,
        "tasa_de_infracciones": 1,
        "nivel_de_educacion_vial": 1,
    },
)
def infracciones_nuevas():
    return integer(
        total_de_infracciones() * tasa_de_infracciones() / nivel_de_educacion_vial()
    )


@component.add(
    name="Nivel de educacion vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"tasa_de_educacion_vial": 1},
)
def nivel_de_educacion_vial():
    return tasa_de_educacion_vial() * 2.5


@component.add(
    name="Paradas no autorizadas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_presion_de_pasajeros": 1,
        "cantidad_del_transporte_informal": 1,
    },
)
def paradas_no_autorizadas():
    return tasa_de_presion_de_pasajeros() * cantidad_del_transporte_informal()


@component.add(
    name="Poblacion que utiliza aplicaciones de transporte",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_poblacion_que_utiliza_aplicaciones_de_transporte": 1},
    other_deps={
        "_integ_poblacion_que_utiliza_aplicaciones_de_transporte": {
            "initial": {},
            "step": {
                "usuarios_de_aplicaciones": 1,
                "usuarios_que_dejan_de_usar_aplicaciones": 1,
            },
        }
    },
)
def poblacion_que_utiliza_aplicaciones_de_transporte():
    return _integ_poblacion_que_utiliza_aplicaciones_de_transporte()


_integ_poblacion_que_utiliza_aplicaciones_de_transporte = Integ(
    lambda: integer(
        usuarios_de_aplicaciones() - usuarios_que_dejan_de_usar_aplicaciones()
    ),
    lambda: 532,
    "_integ_poblacion_que_utiliza_aplicaciones_de_transporte",
)


@component.add(
    name="Politicas de regulacion de transporte",
    comp_type="Constant",
    comp_subtype="Normal",
)
def politicas_de_regulacion_de_transporte():
    return 15000


@component.add(
    name="Seguridad",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"tasa_de_seguridad": 1},
)
def seguridad():
    return tasa_de_seguridad() * 0.75


@component.add(
    name="Tasa de educacion vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_educacion_vial():
    return (
        0.3
        + step(__data["time"], 0.05, 2028)
        + step(__data["time"], 0.05, 2031)
        + step(__data["time"], 0.05, 2034)
    )


@component.add(
    name="Tasa de extorsiones a transportistas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_extorsiones_a_transportistas():
    return (
        0.05
        - step(__data["time"], 0.005, 2028)
        - step(__data["time"], 0.005, 2031)
        - step(__data["time"], 0.005, 2034)
    )


@component.add(
    name="Tasa de infracciones",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_infracciones():
    return (
        0.35
        - step(__data["time"], 0.025, 2028)
        - step(__data["time"], 0.025, 2031)
        - step(__data["time"], 0.025, 2034)
    )


@component.add(
    name="Tasa de inversión de infraestructura",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_inversion_de_infraestructura():
    return (
        0.5
        + step(__data["time"], 0.1, 2028)
        + step(__data["time"], 0.05, 2031)
        - step(__data["time"], 0.125, 2033)
    )


@component.add(
    name="Tasa de personas que usan aplicaciones de transporte",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_personas_que_usan_aplicaciones_de_transporte():
    return (
        0.1
        + step(__data["time"], 0.05, 2028)
        + step(__data["time"], 0.05, 2031)
        + step(__data["time"], 0.05, 2034)
    )


@component.add(
    name="Tasa de presion de pasajeros",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_presion_de_pasajeros():
    return (
        0.4
        - step(__data["time"], 0.05, 2028)
        - step(__data["time"], 0.05, 2031)
        - step(__data["time"], 0.05, 2034)
    )


@component.add(
    name="Tasa de seguridad",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_seguridad():
    return (
        0.5
        + step(__data["time"], 0.05, 2028)
        + step(__data["time"], 0.05, 2031)
        + step(__data["time"], 0.05, 2034)
    )


@component.add(
    name="Tasa de transeuntes que cruzan indebidamente",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_transeuntes_que_cruzan_indebidamente():
    return (
        0.5
        - step(__data["time"], 0.025, 2028)
        - step(__data["time"], 0.05, 2031)
        + step(__data["time"], 0.1, 2033)
    )


@component.add(
    name="Tasa de vehiculos de transporte publico en buen estado",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_vehiculos_de_transporte_publico_en_buen_estado():
    return (
        0.85
        + step(__data["time"], 0.025, 2028)
        + step(__data["time"], 0.025, 2031)
        + step(__data["time"], 0.025, 2034)
    )


@component.add(
    name="Tasa de vehiculos en circulacion",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_vehiculos_en_circulacion():
    return (
        0.2
        + step(__data["time"], 0.05, 2028)
        + step(__data["time"], 0.05, 2031)
        + step(__data["time"], 0.05, 2034)
    )


@component.add(
    name="Total de infracciones",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_total_de_infracciones": 1},
    other_deps={
        "_integ_total_de_infracciones": {
            "initial": {},
            "step": {"infracciones_nuevas": 1, "infracciones_antiguas": 1},
        }
    },
)
def total_de_infracciones():
    return _integ_total_de_infracciones()


_integ_total_de_infracciones = Integ(
    lambda: integer(infracciones_nuevas() - infracciones_antiguas()),
    lambda: 1274,
    "_integ_total_de_infracciones",
)


@component.add(
    name="Total de vehiculos en circulación",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_total_de_vehiculos_en_circulacion": 1},
    other_deps={
        "_integ_total_de_vehiculos_en_circulacion": {
            "initial": {},
            "step": {"vehiculos_circulantes": 1, "vehiculos_que_ya_no_circulan": 1},
        }
    },
)
def total_de_vehiculos_en_circulacion():
    return _integ_total_de_vehiculos_en_circulacion()


_integ_total_de_vehiculos_en_circulacion = Integ(
    lambda: integer(vehiculos_circulantes() - vehiculos_que_ya_no_circulan()),
    lambda: 3578,
    "_integ_total_de_vehiculos_en_circulacion",
)


@component.add(
    name="Transportistas extorsionados",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "extorsiones_a_transportistas": 1,
        "tasa_de_extorsiones_a_transportistas": 1,
    },
)
def transportistas_extorsionados():
    return integer(
        extorsiones_a_transportistas() * tasa_de_extorsiones_a_transportistas()
    )


@component.add(
    name="Uso del transporte publico",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "calidad_de_transporte_publico": 1,
        "poblacion_que_utiliza_aplicaciones_de_transporte": 1,
    },
)
def uso_del_transporte_publico():
    return (
        calidad_de_transporte_publico()
        * 5000
        / poblacion_que_utiliza_aplicaciones_de_transporte()
    )


@component.add(
    name="Usuarios de aplicaciones",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_personas_que_usan_aplicaciones_de_transporte": 1,
        "poblacion_que_utiliza_aplicaciones_de_transporte": 1,
        "eficiencia_de_movilidad": 1,
        "seguridad": 1,
    },
)
def usuarios_de_aplicaciones():
    return integer(
        tasa_de_personas_que_usan_aplicaciones_de_transporte()
        * poblacion_que_utiliza_aplicaciones_de_transporte()
        / eficiencia_de_movilidad()
        / seguridad()
        * 2
    )


@component.add(
    name="Usuarios que dejan de usar aplicaciones",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"uso_del_transporte_publico": 1},
)
def usuarios_que_dejan_de_usar_aplicaciones():
    return uso_del_transporte_publico() / 5


@component.add(
    name="Vehiculos circulantes",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_vehiculos_en_circulacion": 1,
        "total_de_vehiculos_en_circulacion": 1,
    },
)
def vehiculos_circulantes():
    return integer(
        tasa_de_vehiculos_en_circulacion() * total_de_vehiculos_en_circulacion() * 0.9
    )


@component.add(
    name="Vehiculos que ya no circulan",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"uso_del_transporte_publico": 1},
)
def vehiculos_que_ya_no_circulan():
    return integer(uso_del_transporte_publico() * 40)
