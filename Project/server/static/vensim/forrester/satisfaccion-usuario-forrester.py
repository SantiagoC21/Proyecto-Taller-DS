"""
Python model 'satisfaccion-usuario-forrester.py'
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
    name="Tasa de accidentes de transporte",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_accidentes_de_transporte():
    return (
        0.007
        + step(__data["time"], 0.001, 2028)
        + step(__data["time"], 0.001, 2031)
        + step(__data["time"], 0.001, 2034)
    )


@component.add(
    name="Tasa de conductores que consumen alcohol",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_conductores_que_consumen_alcohol():
    return (
        0.05
        - step(__data["time"], 0.01, 2028)
        - step(__data["time"], 0.01, 2031)
        - step(__data["time"], 0.01, 2034)
    )


@component.add(
    name="Infraestructura vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"tasas_de_pagos_ilicitos_en_construccion_vial": 1},
)
def infraestructura_vial():
    return 1 / tasas_de_pagos_ilicitos_en_construccion_vial()


@component.add(
    name="Extorsiones a transportistas",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_extorsiones_a_transportistas": 1},
    other_deps={
        "_integ_extorsiones_a_transportistas": {
            "initial": {},
            "step": {"extorsiones_ocurridas": 1, "casos_resueltos": 1},
        }
    },
)
def extorsiones_a_transportistas():
    return _integ_extorsiones_a_transportistas()


_integ_extorsiones_a_transportistas = Integ(
    lambda: integer(extorsiones_ocurridas() - casos_resueltos()),
    lambda: 28,
    "_integ_extorsiones_a_transportistas",
)


@component.add(
    name="Uso del transporte publico",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "total_de_vehiculos_de_transporte_publico_en_buen_estado": 1,
        "total_de_vehiculos_en_buen_estado": 1,
    },
)
def uso_del_transporte_publico():
    return (
        total_de_vehiculos_de_transporte_publico_en_buen_estado()
        / total_de_vehiculos_en_buen_estado()
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
    depends_on={"extorsiones_a_transportistas": 1, "infraestructura_vial": 1},
)
def estres_a_transportistas():
    return extorsiones_a_transportistas() / infraestructura_vial()


@component.add(
    name="Tasas de pagos ilicitos en construcción vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasas_de_pagos_ilicitos_en_construccion_vial():
    return (
        0.3
        + step(__data["time"], 0.01, 2028)
        + step(__data["time"], 0.01, 2031)
        + step(__data["time"], 0.01, 2034)
    )


@component.add(
    name="Extorsiones ocurridas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_extorsiones_a_transportistas": 1,
        "total_de_vehiculos_en_buen_estado": 1,
    },
)
def extorsiones_ocurridas():
    return integer(
        tasa_de_extorsiones_a_transportistas() * total_de_vehiculos_en_buen_estado()
    )


@component.add(
    name="Fluidez del trafico",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_vial": 1,
        "estrategias_de_ejecucion_de_obras": 1,
        "uso_del_transporte_publico": 1,
    },
)
def fluidez_del_trafico():
    return (
        1
        / (infraestructura_vial() / estrategias_de_ejecucion_de_obras())
        * uso_del_transporte_publico()
        * 13
    )


@component.add(
    name="Tasa de seguridad en transportes",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_seguridad_en_transportes():
    return (
        0.5
        + step(__data["time"], 0.05, 2028)
        + step(__data["time"], 0.025, 2031)
        + step(__data["time"], 0.025, 2034)
    )


@component.add(
    name="Tasa de satisfaccion de usuarios",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_satisfaccion_de_usuarios():
    return (
        0.75
        + step(__data["time"], 0.1, 2028)
        + step(__data["time"], 0.01, 2031)
        + step(__data["time"], 0.01, 2034)
    )


@component.add(
    name="Accidentes antiguos",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"total_de_accidentes_de_transporte": 1},
)
def accidentes_antiguos():
    return total_de_accidentes_de_transporte() * 0.15


@component.add(
    name="Casos resueltos",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "extorsiones_a_transportistas": 1,
        "tasa_de_seguridad_en_transportes": 1,
    },
)
def casos_resueltos():
    return (
        integer(extorsiones_a_transportistas() * tasa_de_seguridad_en_transportes())
        * 3.5
    )


@component.add(
    name="Conductores consumidores de alcohol",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "total_de_conductores_con_consumo_de_alcohol": 1,
        "tasa_de_conductores_que_consumen_alcohol": 1,
    },
)
def conductores_consumidores_de_alcohol():
    return integer(
        total_de_conductores_con_consumo_de_alcohol()
        * tasa_de_conductores_que_consumen_alcohol()
    )


@component.add(
    name="Conductores que dejan de consumir alcohol",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "total_de_conductores_con_consumo_de_alcohol": 1,
        "nivel_de_educacion_vial": 1,
    },
)
def conductores_que_dejan_de_consumir_alcohol():
    return (
        integer(
            total_de_conductores_con_consumo_de_alcohol() * nivel_de_educacion_vial()
        )
        / 2
    )


@component.add(
    name="Congestion vehicular",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"uso_del_transporte_publico": 1},
)
def congestion_vehicular():
    return 2 / uso_del_transporte_publico()


@component.add(
    name="Nuevos accidentes",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_accidentes_de_transporte": 1,
        "total_de_accidentes_de_transporte": 1,
        "total_de_conductores_con_consumo_de_alcohol": 1,
    },
)
def nuevos_accidentes():
    return integer(
        tasa_de_accidentes_de_transporte()
        * total_de_accidentes_de_transporte()
        * total_de_conductores_con_consumo_de_alcohol()
    )


@component.add(
    name="Satisfaccion de usuarios",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "fluidez_del_trafico": 1,
        "tasa_de_satisfaccion_de_usuarios": 1,
        "tasa_de_seguridad_en_transportes": 1,
    },
)
def satisfaccion_de_usuarios():
    return (
        fluidez_del_trafico()
        * tasa_de_satisfaccion_de_usuarios()
        * tasa_de_seguridad_en_transportes()
        * 1.2
    )


@component.add(
    name="Total de conductores con consumo de alcohol",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_total_de_conductores_con_consumo_de_alcohol": 1},
    other_deps={
        "_integ_total_de_conductores_con_consumo_de_alcohol": {
            "initial": {},
            "step": {
                "conductores_consumidores_de_alcohol": 1,
                "conductores_que_dejan_de_consumir_alcohol": 1,
            },
        }
    },
)
def total_de_conductores_con_consumo_de_alcohol():
    return _integ_total_de_conductores_con_consumo_de_alcohol()


_integ_total_de_conductores_con_consumo_de_alcohol = Integ(
    lambda: integer(
        conductores_consumidores_de_alcohol()
        - conductores_que_dejan_de_consumir_alcohol()
    ),
    lambda: 30,
    "_integ_total_de_conductores_con_consumo_de_alcohol",
)


@component.add(
    name="Total de vehiculos de transporte publico en buen estado",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_total_de_vehiculos_de_transporte_publico_en_buen_estado": 1},
    other_deps={
        "_integ_total_de_vehiculos_de_transporte_publico_en_buen_estado": {
            "initial": {},
            "step": {
                "vehiculos_de_transporte_publico_en_buen_estado": 1,
                "vehiculos_de_transporte_en_mal_estado": 1,
            },
        }
    },
)
def total_de_vehiculos_de_transporte_publico_en_buen_estado():
    return _integ_total_de_vehiculos_de_transporte_publico_en_buen_estado()


_integ_total_de_vehiculos_de_transporte_publico_en_buen_estado = Integ(
    lambda: integer(
        vehiculos_de_transporte_publico_en_buen_estado()
        - vehiculos_de_transporte_en_mal_estado()
    ),
    lambda: 2235,
    "_integ_total_de_vehiculos_de_transporte_publico_en_buen_estado",
)


@component.add(
    name="Insatisfaccion de usuarios",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"congestion_vehicular": 1, "total_de_accidentes_de_transporte": 1},
)
def insatisfaccion_de_usuarios():
    return congestion_vehicular() * total_de_accidentes_de_transporte() / 145


@component.add(
    name="Nivel de educación vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"tasa_de_educacion_vial": 1},
)
def nivel_de_educacion_vial():
    return 0.75 * tasa_de_educacion_vial()


@component.add(
    name="Nivel de satisfaccion de usuarios",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_nivel_de_satisfaccion_de_usuarios": 1},
    other_deps={
        "_integ_nivel_de_satisfaccion_de_usuarios": {
            "initial": {},
            "step": {"satisfaccion_de_usuarios": 1, "insatisfaccion_de_usuarios": 1},
        }
    },
)
def nivel_de_satisfaccion_de_usuarios():
    return _integ_nivel_de_satisfaccion_de_usuarios()


_integ_nivel_de_satisfaccion_de_usuarios = Integ(
    lambda: integer(satisfaccion_de_usuarios() - insatisfaccion_de_usuarios()),
    lambda: 25,
    "_integ_nivel_de_satisfaccion_de_usuarios",
)


@component.add(
    name="Vehiculos de transporte en mal estado",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"total_de_vehiculos_de_transporte_publico_en_buen_estado": 1},
)
def vehiculos_de_transporte_en_mal_estado():
    return total_de_vehiculos_de_transporte_publico_en_buen_estado() * 0.05


@component.add(
    name="Vehiculos de transporte publico en buen estado",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "nivel_de_educacion_vial": 1,
        "total_de_vehiculos_en_buen_estado": 1,
        "estres_a_transportistas": 1,
    },
)
def vehiculos_de_transporte_publico_en_buen_estado():
    return integer(
        nivel_de_educacion_vial()
        * total_de_vehiculos_en_buen_estado()
        / estres_a_transportistas()
    )


@component.add(
    name="Vehiculos descompuestos",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"extorsiones_a_transportistas": 1},
)
def vehiculos_descompuestos():
    return extorsiones_a_transportistas() * 1.15


@component.add(
    name="Vehiculos en buen estado",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "tasa_de_inversion_de_mantener_los_vehiculos_en_buen_estado": 1,
        "total_de_vehiculos_en_buen_estado": 1,
    },
)
def vehiculos_en_buen_estado():
    return integer(
        tasa_de_inversion_de_mantener_los_vehiculos_en_buen_estado()
        * total_de_vehiculos_en_buen_estado()
    )


@component.add(
    name="Tasa de educacion vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_educacion_vial():
    return (
        0.5
        + step(__data["time"], 0.025, 2028)
        + step(__data["time"], 0.025, 2031)
        + step(__data["time"], 0.025, 2034)
    )


@component.add(
    name="Tasa de extorsiones a transportistas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_extorsiones_a_transportistas():
    return (
        0.006
        - step(__data["time"], 0.0005, 2028)
        - step(__data["time"], 0.0005, 2031)
        - step(__data["time"], 0.0005, 2034)
    )


@component.add(
    name="Tasa de inversion de mantener los vehiculos en buen estado",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_inversion_de_mantener_los_vehiculos_en_buen_estado():
    return (
        0.05
        + step(__data["time"], 0.01, 2028)
        + step(__data["time"], 0.01, 2031)
        + step(__data["time"], 0.01, 2034)
    )


@component.add(
    name="Total de accidentes de transporte",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_total_de_accidentes_de_transporte": 1},
    other_deps={
        "_integ_total_de_accidentes_de_transporte": {
            "initial": {},
            "step": {"nuevos_accidentes": 1, "accidentes_antiguos": 1},
        }
    },
)
def total_de_accidentes_de_transporte():
    return _integ_total_de_accidentes_de_transporte()


_integ_total_de_accidentes_de_transporte = Integ(
    lambda: integer(nuevos_accidentes() - accidentes_antiguos()),
    lambda: 618,
    "_integ_total_de_accidentes_de_transporte",
)


@component.add(
    name="Total de vehiculos en buen estado",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_total_de_vehiculos_en_buen_estado": 1},
    other_deps={
        "_integ_total_de_vehiculos_en_buen_estado": {
            "initial": {},
            "step": {"vehiculos_en_buen_estado": 1, "vehiculos_descompuestos": 1},
        }
    },
)
def total_de_vehiculos_en_buen_estado():
    return _integ_total_de_vehiculos_en_buen_estado()


_integ_total_de_vehiculos_en_buen_estado = Integ(
    lambda: integer(vehiculos_en_buen_estado() - vehiculos_descompuestos()),
    lambda: 4400,
    "_integ_total_de_vehiculos_en_buen_estado",
)
