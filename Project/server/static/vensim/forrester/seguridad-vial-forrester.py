"""
Python model 'seguridad-vial-forrester.py'
Translated using PySD
"""

from pathlib import Path
import numpy as np

from pysd.py_backend.functions import pulse, integer
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
    name="FINAL TIME", units="Año", comp_type="Constant", comp_subtype="Normal"
)
def final_time():
    """
    El período final de la simulación.
    """
    return __data["time"].final_time()


@component.add(
    name="INITIAL TIME", units="Año", comp_type="Constant", comp_subtype="Normal"
)
def initial_time():
    """
    El período inicial de la simulación.
    """
    return __data["time"].initial_time()


@component.add(
    name="SAVEPER",
    units="Año",
    limits=(0.0, np.nan),
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time_step": 1},
)
def saveper():
    """
    La frecuencia con la que se almacena la salida.
    """
    return __data["time"].saveper()


@component.add(
    name="TIME STEP",
    units="Año",
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
    name="Infraestructura en mantenimiento",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_infraestructura_en_mantenimiento": 1},
    other_deps={
        "_integ_infraestructura_en_mantenimiento": {
            "initial": {},
            "step": {
                "secciones_retiradas_para_mantenimiento": 1,
                "secciones_reparadas": 1,
            },
        }
    },
)
def infraestructura_en_mantenimiento():
    return _integ_infraestructura_en_mantenimiento()


_integ_infraestructura_en_mantenimiento = Integ(
    lambda: secciones_retiradas_para_mantenimiento() - secciones_reparadas(),
    lambda: 50,
    "_integ_infraestructura_en_mantenimiento",
)


@component.add(
    name="Infraestructura de seguridad vial",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_infraestructura_de_seguridad_vial": 1},
    other_deps={
        "_integ_infraestructura_de_seguridad_vial": {
            "initial": {},
            "step": {
                "infraestructura_de_seguridad_vial_en_ejecucion": 1,
                "infraestructura_de_seguridad_vial_obsoleta": 1,
            },
        }
    },
)
def infraestructura_de_seguridad_vial():
    return _integ_infraestructura_de_seguridad_vial()


_integ_infraestructura_de_seguridad_vial = Integ(
    lambda: infraestructura_de_seguridad_vial_en_ejecucion()
    - infraestructura_de_seguridad_vial_obsoleta(),
    lambda: 85,
    "_integ_infraestructura_de_seguridad_vial",
)


@component.add(
    name="Dispositivos de seguridad vial retirados por falla",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "dispositivos_viales_operativos": 1,
        "tasa_de_retiro_de_dispositivos_por_falla": 1,
    },
)
def dispositivos_de_seguridad_vial_retirados_por_falla():
    return dispositivos_viales_operativos() * tasa_de_retiro_de_dispositivos_por_falla()


@component.add(
    name="Tasa de retiro de dispositivos por falla",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_retiro_de_dispositivos_por_falla():
    return (
        0.005
        + 0.002 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.005 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.015 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )


@component.add(
    name="Costo promedio mantenimiento infraestructura",
    comp_type="Constant",
    comp_subtype="Normal",
)
def costo_promedio_mantenimiento_infraestructura():
    return 20


@component.add(
    name="Fondos asignados para mantenimiento",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "presupuesto_mantenimiento_de_infraestructura": 1,
        "tasa_de_mantenimiento_infraestructura": 1,
    },
)
def fondos_asignados_para_mantenimiento():
    return (
        presupuesto_mantenimiento_de_infraestructura()
        * tasa_de_mantenimiento_infraestructura()
    )


@component.add(
    name="Gastos en mantenimiento",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_en_mantenimiento": 1,
        "costo_promedio_mantenimiento_infraestructura": 1,
    },
)
def gastos_en_mantenimiento():
    return (
        infraestructura_en_mantenimiento()
        * costo_promedio_mantenimiento_infraestructura()
    )


@component.add(
    name="Gastos Totales Infraestructura seguridad vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_de_seguridad_vial_en_ejecucion": 1,
        "servicios_tecnicos_para_seguridad_vial": 1,
        "equipamiento_vial_adquirida": 1,
        "gastos_en_mantenimiento": 1,
        "dispositivos_viales_operativos": 1,
        "tasa_de_instalacion_de_nuevos_dispositivos": 1,
    },
)
def gastos_totales_infraestructura_seguridad_vial():
    return (
        infraestructura_de_seguridad_vial_en_ejecucion() * 800
        + servicios_tecnicos_para_seguridad_vial()
        + equipamiento_vial_adquirida()
        + gastos_en_mantenimiento()
        + dispositivos_viales_operativos()
        * 500
        * tasa_de_instalacion_de_nuevos_dispositivos()
    )


@component.add(
    name="Tasa de reparación de infraestructura seguridad",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_reparacion_de_infraestructura_seguridad():
    return (
        0.1
        + 0.2 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.1 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.1 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )


@component.add(
    name="Tasa de mantenimiento correctivo seguridad",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_mantenimiento_correctivo_seguridad():
    return (
        0.3
        + 0.2 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.1 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.25 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )


@component.add(
    name="Presupuesto mantenimiento de infraestructura",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_presupuesto_mantenimiento_de_infraestructura": 1},
    other_deps={
        "_integ_presupuesto_mantenimiento_de_infraestructura": {
            "initial": {},
            "step": {
                "fondos_asignados_para_mantenimiento": 1,
                "gastos_en_mantenimiento": 1,
            },
        }
    },
)
def presupuesto_mantenimiento_de_infraestructura():
    return _integ_presupuesto_mantenimiento_de_infraestructura()


_integ_presupuesto_mantenimiento_de_infraestructura = Integ(
    lambda: fondos_asignados_para_mantenimiento() - gastos_en_mantenimiento(),
    lambda: 100000,
    "_integ_presupuesto_mantenimiento_de_infraestructura",
)


@component.add(
    name="Dispositivos de seguridad vial instalados nuevos",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "dispositivos_viales_operativos": 1,
        "tasa_de_instalacion_de_nuevos_dispositivos": 1,
    },
)
def dispositivos_de_seguridad_vial_instalados_nuevos():
    return (
        dispositivos_viales_operativos() * tasa_de_instalacion_de_nuevos_dispositivos()
    )


@component.add(
    name="Dispositivos viales operativos",
    comp_type="Stateful",
    comp_subtype="Integ",
    depends_on={"_integ_dispositivos_viales_operativos": 1},
    other_deps={
        "_integ_dispositivos_viales_operativos": {
            "initial": {},
            "step": {
                "dispositivos_de_seguridad_vial_instalados_nuevos": 1,
                "dispositivos_de_seguridad_vial_retirados_por_falla": 1,
            },
        }
    },
)
def dispositivos_viales_operativos():
    return _integ_dispositivos_viales_operativos()


_integ_dispositivos_viales_operativos = Integ(
    lambda: dispositivos_de_seguridad_vial_instalados_nuevos()
    - dispositivos_de_seguridad_vial_retirados_por_falla(),
    lambda: 85,
    "_integ_dispositivos_viales_operativos",
)


@component.add(
    name="Tasa de mantenimiento infraestructura",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_mantenimiento_infraestructura():
    return (
        0.004
        + 0.002 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.001 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.021 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )


@component.add(
    name="Tasa de instalación de nuevos dispositivos",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_de_instalacion_de_nuevos_dispositivos():
    return (
        0.15
        + 0.02 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.01 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.21 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )


@component.add(
    name="Secciones reparadas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_en_mantenimiento": 1,
        "tasa_de_reparacion_de_infraestructura_seguridad": 1,
    },
)
def secciones_reparadas():
    return (
        infraestructura_en_mantenimiento()
        * tasa_de_reparacion_de_infraestructura_seguridad()
    )


@component.add(
    name="Secciones retiradas para mantenimiento",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_en_mantenimiento": 1,
        "tasa_de_mantenimiento_correctivo_seguridad": 1,
    },
)
def secciones_retiradas_para_mantenimiento():
    return (
        infraestructura_en_mantenimiento()
        * tasa_de_mantenimiento_correctivo_seguridad()
    )


@component.add(
    name="Infraestructura de seguridad vial en ejecución",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_de_seguridad_vial": 1,
        "tasa_ejecucion_seguridad_vial": 1,
    },
)
def infraestructura_de_seguridad_vial_en_ejecucion():
    return integer(
        infraestructura_de_seguridad_vial() * tasa_ejecucion_seguridad_vial()
    )


@component.add(
    name="Infraestructura de seguridad vial obsoleta",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={
        "infraestructura_de_seguridad_vial": 1,
        "tasa_infraestructura_seguridad_vial_obsoletas": 1,
    },
)
def infraestructura_de_seguridad_vial_obsoleta():
    return integer(
        infraestructura_de_seguridad_vial()
        * tasa_infraestructura_seguridad_vial_obsoletas()
    )


@component.add(
    name="Equipamiento vial adquirida",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"infraestructura_de_seguridad_vial": 1},
)
def equipamiento_vial_adquirida():
    return integer(infraestructura_de_seguridad_vial() * 2)


@component.add(
    name="Servicios tecnicos para seguridad vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"infraestructura_de_seguridad_vial": 1},
)
def servicios_tecnicos_para_seguridad_vial():
    return infraestructura_de_seguridad_vial() * 1.5


@component.add(
    name="Tasa Ejecucion Seguridad Vial",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_ejecucion_seguridad_vial():
    return (
        0.05
        + 0.02 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.01 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.01 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )


@component.add(
    name="Tasa Infraestructura Seguridad Vial Obsoletas",
    comp_type="Auxiliary",
    comp_subtype="Normal",
    depends_on={"time": 3},
)
def tasa_infraestructura_seguridad_vial_obsoletas():
    return (
        0.007
        + 0.02 * pulse(__data["time"], 2026, repeat_time=2, width=0, end=2036)
        + 0.01 * pulse(__data["time"], 2026, repeat_time=5, width=0, end=2036)
        + 0.01 * pulse(__data["time"], 2026, repeat_time=3, width=0, end=2036)
    )
