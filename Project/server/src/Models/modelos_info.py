modelos_info = {
    'Frecuencia_de_mantenimiento': {
        'submodelos': {
            'Disponibilidad_de_la_flot': {
                'variables': [
                    'Disponibilidad_de_la_flot', 'Vehiculos_que_regresan_de_mantenimiento', 
                    'Vehiculos_que_se_retiro_por_mantenimiento', 'Vehiculos_asignados_a_operar',
                    'Total_de_la_flota', 'Tasa_inoperatividad_fallas', 'Demanda_de_operacion',
                    'Tasa_fallas_mecanicas', 'Objetivo1', 'Discrepancia1'
                ],
                'graficar': [
                    'Disponibilidad_de_la_flot', 'Vehiculos_que_regresan_de_mantenimiento',
                    'Vehiculos_que_se_retiro_por_mantenimiento'
                ]
            },

            'Cantidad_de_fallas_mecanicas': {
                'variables': [
                    'Cantidad_de_fallas_mecanicas', 'Numero_de_veces_que_ocurre_una_falla_mecanica',
                    'Reparacion_de_fallas_mecanicas', 'Cantidad_de_reparaciones_preventivas',
                    'Tasa_reparacion_fallas_mecanicas', 'Tasa_reparaciones_preventivas',
                    'Cantidad_de_vehiculos_destinados_a_mantenimiento_correctivo',
                    'Cantidad_de_vehiculos_destinados_a_mantenimiento_preventivo',
                    'Objetivo2', 'Discrepancia2'
                ],
                'graficar': [
                    'Cantidad_de_fallas_mecanicas', 'Numero_de_veces_que_ocurre_una_falla_mecanica',
                    'Reparacion_de_fallas_mecanicas'
                ]
            },

            'Cantidad_de_vehiculos_en_operacion': {
                'variables': [
                    'Cantidad_de_vehiculos_en_operacion', 'Vehiculos_asignados_a_operar',
                    'Vehiculos_devueltos_al_deposito', 'Tasa_asignacion', 'Demanda_de_operacion',
                    'Tasa_retorno_deposito', 'Cantidad_de_malas_maniobras',
                    'Cantidad_promedio_de_malas_maniobras_por_vehiculo', 'Objetivo3', 'Discrepancia3'
                ],
                'graficar': [
                    'Cantidad_de_vehiculos_en_operacion', 'Vehiculos_asignados_a_operar',
                    'Vehiculos_devueltos_al_deposito'
                ]
            },

            'Disponibilidad_de_talleres': {
                'variables': [
                    'Disponibilidad_de_talleres','Cantidad_de_plazas_sin_asignacion_de_mantenimiento', 'Cantidad_de_plazas_apartadas_por_mantenimiento',
                    'Cantidad_de_plazas_ocupadas', 'Demanda_por_mantenimiento', 
                    'Cantidad_de_vehiculos_destinados_a_mantenimiento_preventivo',
                    'Proporcion_vehiculos_mantenimiento_correctivo', 'Capacidad_de_atencion_por_plaza',
                    'Tasa_de_liberacion_de_plazas', 'Cantidad_de_vehiculos_que_terminan_el_mantenimiento_por_semana',
                    'Objetivo4', 'Discrepancia4'
                ],
                'graficar': [
                    'Disponibilidad_de_talleres', 'Cantidad_de_plazas_sin_asignacion_de_mantenimiento',
                    'Cantidad_de_plazas_apartadas_por_mantenimiento'
                ]
            }
        }
    },
    'Satisfaccion_de_autoridades': {
        'submodelos': {
            'Inversion_en_infraestructura': {
                'variables': [
                    'Inversion_en_infraestructura', 'Flujo_de_inversion', 'Depreciacion_de_inversion', 
                    'Porcentaje_de_inversion', 'Tasa_de_recaudacion'
                ],
                'graficar': [
                    'Inversion_en_infraestructura', 'Flujo_de_inversion',
                    'Depreciacion_de_inversion'
                ]
            },

            'Calidad_de_infraestructura_vial': {
                'variables': [
                    'Calidad_de_infraestructura_vial', 'Mejora_de_infraestructura', 'Deterioro_de_infraestructura',
                    'Total_regulaciones_viales', 'Satisfaccion_de_usuarios', 'Congestion_vehicular', 'Fluidez_del_trafico'
                ],
                'graficar': [
                    'Calidad_de_infraestructura_vial', 'Mejora_de_infraestructura',
                    'Deterioro_de_infraestructura'
                ]
            },

            'Confianza_publica': {
                'variables': [
                    'Confianza_publica', 'Recuperacion_de_confianza', 'Perdida_de_confianza', 
                    'Satisfaccion_de_autoridades_de_transporte', 'Satisfaccion_de_usuarios', 'Tasa_de_viajes_de_transporte'
                ],
                'graficar': [
                    'Confianza_publica', 'Recuperacion_de_confianza',
                    'Perdida_de_confianza'
                ]
            },

            'Imagen_publica_de_autoridades': {
                'variables': [
                    'Imagen_publica_de_autoridades', 'Mejora_de_imagen', 'Deterioro_de_imagen', 'Tasa_de_quejas_de_usuarios',
                    'Quejas_de_usuarios', 'Satisfaccion_de_usuarios', 'Satisfaccion_de_autoridades_de_transporte'
                ],
                'graficar': [
                    'Imagen_publica_de_autoridades', 'Mejora_de_imagen',
                    'Deterioro_de_imagen'
                ]
            }
        
        }
    },
    'Satisfaccion_de_usuario': {
        'submodelos': {
            'Total_de_vehiculos_en_buen_estado': {
                'variables': [
                    'Total_de_vehiculos_en_buen_estado', 'Vehiculos_en_buen_estado', 'Vehiculos_descompuestos',
                    'Tasa_de_inversion_de_mantener_los_vehiculos_en_buen_estado'
                ],
                'graficar': [
                    'Total_de_vehiculos_en_buen_estado', 'Vehiculos_en_buen_estado',
                    'Vehiculos_descompuestos'
                ]
            },

            'Total_de_vehiculos_de_transporte_publico_en_buen_estado': {
                'variables': [
                    'Total_de_vehiculos_de_transporte_publico_en_buen_estado', 'Vehiculos_de_transporte_publico_en_buen_estado',
                    'Vehiculos_de_transporte_en_mal_estado', 'Uso_del_transporte_publico', 'Nivel_de_educacion_vial',
                    'Tasa_de_educacion_vial'
                ],
                'graficar': [
                    'Total_de_vehiculos_de_transporte_publico_en_buen_estado', 'Vehiculos_de_transporte_publico_en_buen_estado',
                    'Vehiculos_de_transporte_en_mal_estado'
                ]
            },

            'Total_de_conductores_con_consumo_de_alcohol': {
                'variables': [
                    'Total_de_conductores_con_consumo_de_alcohol', 'Conductores_consumidores_de_alcohol',
                    'Conductores_que_dejan_de_consumir_alcohol', 'Tasa_de_conductores_que_consumen_alcohol',
                    'Nivel_de_educacion_vial'
                ],
                'graficar': [
                    'Total_de_conductores_con_consumo_de_alcohol', 'Conductores_consumidores_de_alcohol',
                    'Conductores_que_dejan_de_consumir_alcohol'
                ]
            },

            'Extorsiones_a_transportistas': {
                'variables': [
                    'Extorsiones_a_transportistas', 'Extorsiones_ocurridas', 'Casos_resueltos', 'Tasa_de_extorsiones_a_transportistas',
                    'Tasa_de_seguridad_en_transportes', 'Estres_a_transportistas'
                ],
                'graficar': [
                    'Extorsiones_a_transportistas', 'Extorsiones_ocurridas',
                    'Casos_resueltos'
                ]
            },

            'Nivel_de_satisfaccion_de_usuarios': {
                'variables': [
                    'Nivel_de_satisfaccion_de_usuarios', 'Satisfaccion_de_usuarios', 'Insatisfaccion_de_usuarios',
                    'Tasa_de_satisfaccion_de_usuarios', 'Tasa_de_seguridad_en_transportes', 'Fluidez_del_trafico',
                    'Congestion_vehicular'
                ],
                'graficar': [
                    'Nivel_de_satisfaccion_de_usuarios', 'Satisfaccion_de_usuarios',
                    'Insatisfaccion_de_usuarios'
                ]
            },

            'Total_de_accidentes_de_transporte': {
                'variables': [
                    'Total_de_accidentes_de_transporte', 'Nuevos_accidentes', 'Accidentes_antiguos', 
                    'Tasa_de_accidentes_de_transporte'
                ],
                'graficar': [
                    'Total_de_accidentes_de_transporte', 'Nuevos_accidentes',
                    'Accidentes_antiguos'
                ]
            }
        }
    },
    'Seguridad_vial': {
        'submodelos': {
            'Infraestructura_seguridad_vial': {
                'variables': [
                    'Infraestructura_seguridad_vial', 'Infraestructura_seguridad_vial_en_ejecucion',
                    'Infraestructura_seguridad_vial_obsoleta', 'Gastos_Totales_Infraestructura_seguridad_vial',
                    'Equipamiento_vial_adquirida', 'Servicios_tecnicos_para_seguridad_vial', 'Tasa_Ejecucion_Seguridad_Vial',
                    'Tasa_Infrastructure_Seguridad_Vial_Obsoletas'
                ],
                'graficar': [
                    'Infraestructura_seguridad_vial', 'Infraestructura_seguridad_vial_en_ejecucion',
                    'Infraestructura_seguridad_vial_obsoleta'
                ]
            },
            'Dispositivos_viales_operativos': {
                'variables': [
                    'Dispositivos_viales_operativos', 'Dispositivos_seguridad_vial_instalados_nuevos',
                    'Dispositivos_seguridad_vial_retirados_por_falla', 'Tasa_de_instalacion_de_nuevos_dispositivos',
                    'Tasa_de_retiro_de_dispositivos_por_falla'
                ],
                'graficar': [
                    'Dispositivos_viales_operativos', 'Dispositivos_seguridad_vial_instalados_nuevos',
                    'Dispositivos_seguridad_vial_retirados_por_falla'
                ]
            },
            'Infraestructura_en_mantenimiento': {
                'variables': [
                    'Infraestructura_en_mantenimiento', 'Secciones_retiradas_para_mantenimiento', 
                    'Secciones_reparadas', 'Tasa_de_reparacion_de_infraestructura_seguridad', 
                    'Tasa_de_mantenimiento_correctivo_seguridad'
                ],
                'graficar': [
                    'Infraestructura_en_mantenimiento', 'Secciones_retiradas_para_mantenimiento',
                    'Secciones_reparadas'
                ]
            },
            'Presupuesto_mantenimiento_de_infraestructura': {
                'variables': [
                    'Presupuesto_mantenimiento_de_infraestructura', 'Fondos_asignados_para_mantenimiento',
                    'Gastos_en_mantenimiento', 'Costo_promedio_mantenimiento_infraestructura', 
                    'Tasa_de_mantenimiento_infraestructura'
                ],
                'graficar': [
                    'Presupuesto_mantenimiento_de_infraestructura', 'Fondos_asignados_para_mantenimiento',
                    'Gastos_en_mantenimiento'
                ]
            }
        }
    },
    'Eficiencia_de_movilidad': {
        'submodelos': {
            'Poblacion_que_utiliza_aplicaciones_de_transporte': {
                'variables': [
                    'Poblacion_que_utiliza_aplicaciones_de_transporte', 'Usuarios_de_aplicaciones',
                    'Usuarios_que_dejan_de_usar_aplicaciones', 'Tasa_de_personas_que_usan_aplicaciones_de_transporte',
                    'Uso_del_transporte_publico', 'Seguridad'
                ],
                'graficar': [
                    'Poblacion_que_utiliza_aplicaciones_de_transporte', 'Usuarios_de_aplicaciones',
                    'Usuarios_que_dejan_de_usar_aplicaciones'
                ]
            },
            'Total_de_vehiculos_en_circulacion': {
                'variables': [
                    'Total_de_vehiculos_en_circulacion', 'Vehiculos_circulantes', 'Vehiculos_que_ya_no_circulan',
                    'Tasa_de_vehiculos_en_circulacion', 'Uso_del_transporte_publico'
                ],
                'graficar': [
                    'Total_de_vehiculos_en_circulacion', 'Vehiculos_circulantes',
                    'Vehiculos_que_ya_no_circulan'
                ]
            },
            'Extorsiones_a_transportistas': {
                'variables': [
                    'Extorsiones_a_transportistas', 'Transportistas_extorsionados', 'Casos_que_han_sido_solucionados',
                    'Seguridad', 'Estres_a_transportistas', 'Tasa_de_extorsiones_a_transportistas', 
                    'Tasa_de_presion_de_pasajeros'
                ],
                'graficar': [
                    'Extorsiones_a_transportistas', 'Transportistas_extorsionados',
                    'Casos_que_han_sido_solucionados'
                ]
            },
            'Total_de_infracciones': {
                'variables': [
                    'Total_de_infracciones', 'Infracciones_nuevas', 'Infracciones_antiguas', 
                    'Tasa_de_infracciones', 'Nivel_de_educacion_vial', 'Congestion_vehicular'
                ],
                'graficar': [
                    'Total_de_infracciones', 'Infracciones_nuevas',
                    'Infracciones_antiguas'
                ]
            },
            'Eficiencia_de_movilidades': {
                'variables': [
                    'Eficiencia_de_movilidades', 'Facilidad_de_movilidades', 'Dificultad_de_movilidades',
                    'Fluidez_del_trafico', 'Congestion_vehicular'
                ],
                'graficar': [
                    'Eficiencia_de_movilidades', 'Facilidad_de_movilidades',
                    'Dificultad_de_movilidades'
                ]
            }
        }
    }
}
