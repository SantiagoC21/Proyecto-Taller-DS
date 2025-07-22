export const mockDescriptionTabla = {
  "1": {
    title: "Total de accidentes por clase",
    description: "Esta tabla muestra la distribución anual de accidentes de tránsito clasificados por tipo de evento. Los datos incluyen choques, atropellos, volcaduras, caídas y otros tipos de incidentes viales. Esta información es fundamental para identificar patrones y tendencias en la accidentalidad vial, permitiendo a las autoridades enfocar sus esfuerzos de prevención en los tipos de accidentes más frecuentes."
  },
  "2": {
    title: "Total causas de los accidentes",
    description: "Análisis detallado de los factores causales de los accidentes de tránsito. Incluye causas relacionadas con el conductor (exceso de velocidad, imprudencia, ebriedad), factores del peatón, condiciones del vehículo, estado de la vía y factores ambientales. Esta información es crucial para desarrollar estrategias de prevención específicas y programas de educación vial dirigidos."
  },
  "3": {
    title: "Total de vehículos participantes",
    description: "Clasificación de los vehículos involucrados en accidentes de tránsito, divididos en vehículos mayores (automóviles, camiones, ómnibus) y menores (motocicletas, bicicletas, motocarros). Esta segmentación permite entender qué tipos de vehículos están más expuestos a accidentes y desarrollar medidas de seguridad específicas para cada categoría."
  },
  "4": {
    title: "Total lugar de ocurrencia",
    description: "Distribución geográfica y tipológica de los lugares donde ocurren los accidentes de tránsito. Incluye autopistas, calles, avenidas, cruces y carreteras. Esta información ayuda a identificar puntos críticos de accidentalidad y priorizar inversiones en infraestructura vial y señalización."
  },
  "5": {
    title: "Total por incidencia horaria",
    description: "Análisis temporal de la ocurrencia de accidentes distribuidos en franjas horarias de 2 horas. Permite identificar las horas del día con mayor riesgo de accidentes, facilitando la planificación de operativos de control de tránsito y campañas de prevención en horarios específicos."
  },
  "6": {
    title: "Total por incidencia diaria",
    description: "Distribución semanal de los accidentes de tránsito, mostrando la variación en la accidentalidad según el día de la semana. Esta información es valiosa para entender los patrones de movilidad y riesgo asociados a diferentes días, incluyendo fines de semana y días laborables."
  },
  "7": {
    title: "Total de heridos",
    description: "Estadísticas de personas lesionadas en accidentes de tránsito, clasificadas por grupos etarios y género. Esta información es fundamental para dimensionar el impacto humano de los accidentes viales y desarrollar políticas de atención médica de emergencia y prevención dirigidas a grupos vulnerables."
  },
  "8": {
    title: "Tipo de Conductor",
    description: "Caracterización demográfica de los conductores involucrados en accidentes y análisis del tipo de licencia de conducir. Incluye distribución por edad, género y categoría de licencia (profesional, particular, vehículo menor). Esta información es esencial para evaluar la efectividad de los programas de formación de conductores y identificar grupos que requieren capacitación adicional."
  }
};

export const getDescriptionTabla = (modelId: string) => {
  return mockDescriptionTabla[modelId as keyof typeof mockDescriptionTabla] || {
    title: "Información no disponible",
    description: "No se encontró descripción para este modelo."
  };
};