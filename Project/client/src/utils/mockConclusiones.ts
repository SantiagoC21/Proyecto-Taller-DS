export const mockConclusiones = {
  title: "Conclusiones y Recomendaciones del Sistema de Transporte Terrestre",
  introduction: "Basado en el análisis exhaustivo de los datos históricos de accidentes de tránsito y la implementación del sistema de dinámica de sistemas, se presentan las siguientes conclusiones y recomendaciones estratégicas para mejorar la seguridad vial.",
  
  sections: [
    {
      id: "hallazgos",
      title: "Principales Hallazgos",
      icon: "TrendingUp",
      content: [
        {
          subtitle: "Patrones de Accidentalidad",
          text: "Los datos revelan que la imprudencia del conductor representa la causa principal de accidentes, seguida por el exceso de velocidad. Esta tendencia se mantiene consistente a lo largo del período analizado, indicando la necesidad de intervenciones específicas en educación vial."
        },
        {
          subtitle: "Distribución Temporal",
          text: "Se observa una mayor incidencia de accidentes durante las horas pico (8:00-10:00 y 16:00-18:00) y los días laborables, especialmente martes y jueves. Los fines de semana muestran patrones diferentes con mayor incidencia de accidentes relacionados con alcohol."
        },
        {
          subtitle: "Tipos de Vehículos",
          text: "El crecimiento en la participación de vehículos menores (motocicletas y motocarros) en accidentes es significativo, reflejando cambios en los patrones de movilidad urbana y la necesidad de políticas específicas para este segmento."
        }
      ]
    },
    {
      id: "conclusiones",
      title: "Conclusiones",
      icon: "Target",
      content: [
        {
          subtitle: "Impacto de la Imprudencia del Conductor",
          text: "La imprudencia del conductor se mantiene como la principal causa de accidentes a lo largo del tiempo, representando más del 60% de los casos. Esta consistencia indica la necesidad urgente de intervenciones específicas y sostenidas en educación vial."
        },
        {
          subtitle: "Evolución de la Participación Vehicular",
          text: "Se observa un crecimiento significativo en la participación de vehículos menores en accidentes, lo que refleja cambios en los patrones de movilidad urbana y requiere adaptación de las políticas de seguridad vial."
        },
        {
          subtitle: "Patrones Temporales Críticos",
          text: "Los datos confirman patrones temporales específicos de alta incidencia que permiten una planificación más efectiva de recursos y operativos de prevención."
        }
      ]
    },
    {
      id: "recomendaciones",
      title: "Recomendaciones",
      icon: "Shield",
      content: [
        {
          subtitle: "Educación y Concientización",
          text: "Implementar campañas intensivas de educación vial enfocadas en la reducción de la imprudencia del conductor y el control de velocidad. Estas campañas deben ser diferenciadas por tipo de vehículo y grupo demográfico."
        },
        {
          subtitle: "Infraestructura y Control",
          text: "Priorizar inversiones en señalización y mejoras de infraestructura en autopistas y avenidas principales. Intensificar operativos policiales durante horas y días de mayor incidencia identificados en el análisis."
        },
        {
          subtitle: "Medidas Específicas por Tipo de Vehículo",
          text: "Crear programas específicos de formación para motociclistas y conductores de vehículos menores. Implementar sistemas de monitoreo y control diferenciados según el tipo de vehículo y las características del conductor."
        }
      ]
    }
  ],
  
  callToAction: {
    title: "Próximos Pasos",
    text: "La implementación exitosa de estas recomendaciones requiere un enfoque coordinado y sostenido. Se recomienda establecer un comité interinstitucional para supervisar la implementación y monitorear el progreso utilizando el sistema de dinámica desarrollado.",
    actions: [
      "Formar comité interinstitucional de seguridad vial",
      "Desarrollar cronograma de implementación por fases",
      "Establecer indicadores de seguimiento y evaluación",
      "Asignar presupuesto específico para cada medida",
      "Crear sistema de reporte y monitoreo continuo"
    ]
  }
};

export const getConclusiones = () => mockConclusiones;