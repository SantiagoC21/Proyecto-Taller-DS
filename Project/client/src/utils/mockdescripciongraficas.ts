export const mockDescripcionGraficas = {
  "1": {
    title: "Evolución de accidentes por clase",
    description: "Las gráficas muestran la evolución temporal de diferentes tipos de accidentes de tránsito. Se pueden observar tendencias, picos estacionales y cambios en los patrones de accidentalidad. Los choques y atropellos suelen ser los más frecuentes, mientras que eventos como volcaduras e incendios muestran menor incidencia pero mayor gravedad. El análisis de estas tendencias permite evaluar la efectividad de las medidas de seguridad vial implementadas."
  },
  "2": {
    title: "Tendencias en causas de accidentes",
    description: "Visualización de la evolución de los factores causales de accidentes a lo largo del tiempo. La imprudencia del conductor se mantiene como la causa principal, seguida por el exceso de velocidad y la ebriedad. Las gráficas permiten identificar si las campañas de concientización y las medidas de control están teniendo impacto en la reducción de causas específicas."
  },
  "3": {
    title: "Participación vehicular en accidentes",
    description: "Análisis gráfico de la evolución en la participación de diferentes tipos de vehículos en accidentes. Se observa el crecimiento en la participación de vehículos menores (motocicletas, motocarros) versus vehículos mayores. Esta información es crucial para adaptar las políticas de seguridad vial a los cambios en el parque automotor y los patrones de movilidad urbana."
  },
  "4": {
    title: "Distribución espacial de accidentes",
    description: "Representación gráfica de cómo se distribuyen los accidentes según el tipo de vía. Las autopistas y avenidas principales suelen concentrar mayor número de accidentes debido al mayor flujo vehicular, mientras que calles y pasajes muestran patrones diferentes. Esta visualización ayuda a priorizar intervenciones de infraestructura y señalización."
  },
  "5": {
    title: "Patrones horarios de accidentalidad",
    description: "Gráficas que revelan los patrones de accidentalidad a lo largo del día. Típicamente se observan picos en horas de mayor tráfico (mañana y tarde) y durante la noche en fines de semana. Esta información es fundamental para la planificación de operativos policiales y campañas de prevención en horarios críticos."
  },
  "6": {
    title: "Variación semanal de accidentes",
    description: "Visualización de cómo varía la accidentalidad según el día de la semana. Los fines de semana suelen mostrar patrones diferentes a los días laborables, con mayor incidencia de accidentes relacionados con alcohol y velocidad. Esta información guía la planificación de recursos de emergencia y operativos de control."
  },
  "7": {
    title: "Evolución de lesionados por accidentes",
    description: "Gráficas que muestran la evolución del número de personas heridas en accidentes, segmentadas por edad y género. Permite identificar grupos poblacionales más vulnerables y evaluar la efectividad de las medidas de protección. Los jóvenes adultos suelen mostrar mayor incidencia, especialmente en el género masculino."
  },
  "8": {
    title: "Perfil de conductores en accidentes",
    description: "Análisis gráfico del perfil demográfico de conductores involucrados en accidentes y su relación con el tipo de licencia. Permite evaluar la efectividad de los programas de formación y identificar necesidades de capacitación específicas. La correlación entre edad, tipo de licencia y accidentalidad es clave para mejorar los sistemas de formación vial."
  }
};

export const getDescripcionGraficas = (modelId: string) => {
  return mockDescripcionGraficas[modelId as keyof typeof mockDescripcionGraficas] || {
    title: "Información no disponible",
    description: "No se encontró descripción para este modelo."
  };
};