CREATE DATABASE IF NOT EXISTS vensimwebGp2;
USE vensimwebGp2;


-- Tabla de colores (solo si deseas mantenerlo para otros usos)
CREATE TABLE IF NOT EXISTS color (
  idColor INT AUTO_INCREMENT PRIMARY KEY,
  nameColor VARCHAR(50) UNIQUE NOT NULL
);

INSERT IGNORE INTO color (idColor, nameColor) VALUES
(1, '#1f77b4'), (2, '#ff7f0e'), (3, '#2ca02c'), (4, '#d62728'),
(5, '#9467bd'), (6, '#8c564b'), (7, '#e377c2'), (8, '#7f7f7f'),
(9, '#bcbd22'), (10, '#17becf');

-- Tabla: model
CREATE TABLE IF NOT EXISTS model (
  idModel INT AUTO_INCREMENT PRIMARY KEY,
  nameModel VARCHAR(100) UNIQUE NOT NULL
);

-- Tabla: submodel
CREATE TABLE IF NOT EXISTS submodel (
  idSubmodel INT AUTO_INCREMENT PRIMARY KEY,
  idModel INT NOT NULL,
  nameSubmodel VARCHAR(200) NOT NULL,
  title VARCHAR(200),
  nameLabelX VARCHAR(100),
  nameLabelY VARCHAR(100),
  position INT DEFAULT 0,
  UNIQUE(nameSubmodel),
  FOREIGN KEY (idModel) REFERENCES model(idModel) ON DELETE CASCADE
);


-- Insertar modelos principales
INSERT IGNORE INTO model (idModel, nameModel) VALUES
(1, 'Frecuencia_de_mantenimiento'),
(2, 'Satisfaccion_de_autoridades'),
(3, 'Satisfaccion_de_usuario'),
(4, 'Seguridad_vial'),
(5, 'Eficiencia_de_movilidad');

-- Insertar submodelos con eje X = 'Año'

-- Modelo: Frecuencia_de_mantenimiento
INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel, title, nameLabelX, nameLabelY, position) VALUES
(1, 1, 'Disponibilidad de la flota', 'Comportamiento de Disponibilidad de la flota', 'Año', 'Unidades', 1),
(2, 1, 'Cantidad de fallas mecanicas', 'Comportamiento de Cantidad de fallas mecánicas', 'Año', 'Eventos', 2),
(3, 1, 'Cantidad de vehiculos en operacion', 'Comportamiento de Cantidad de vehículos en operación', 'Año', 'Vehículos', 3),
(4, 1, 'Disponibilidad de talleres', 'Comportamiento de Disponibilidad de talleres', 'Año', 'Plazas', 4);

-- Modelo: Satisfaccion_de_autoridades
INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel, title, nameLabelX, nameLabelY, position) VALUES
(5, 2, 'Inversion en infraestructura', 'Comportamiento de Inversión en infraestructura', 'Año', 'Millones S/.', 1),
(6, 2, 'Calidad de infraestructura vial', 'Comportamiento de Calidad de infraestructura vial', 'Año', 'Índice', 2),
(7, 2, 'Confianza pública', 'Comportamiento de Confianza pública', 'Año', 'Índice', 3),
(8, 2, 'Imagen pública de autoridades', 'Comportamiento de Imagen pública de autoridades', 'Año', 'Índice', 4);

-- Modelo: Satisfaccion_de_usuario
INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel, title, nameLabelX, nameLabelY, position) VALUES
(9, 3, 'Total de vehiculos en buen estado', 'Comportamiento de Total de vehículos en buen estado', 'Año', 'Vehículos', 1),
(10, 3, 'Total de vehiculos de transporte publico en buen estado', 'Comportamiento de Vehículos transporte público en buen estado', 'Año', 'Vehículos', 2),
(11, 3, 'Total de conductores con consumo de alcohol', 'Comportamiento de Conductores con consumo de alcohol', 'Año', 'Conductores', 3),
(12, 3, 'Extorsiones a transportistas', 'Comportamiento de Extorsiones a transportistas', 'Año', 'Casos', 4),
(13, 3, 'Nivel de satisfaccion de usuarios', 'Comportamiento de Nivel de satisfacción de usuarios', 'Año', 'Índice', 5),
(14, 3, 'Total de accidentes de transporte', 'Comportamiento de Accidentes de transporte', 'Año', 'Cantidad', 6);

-- Modelo: Seguridad_vial
INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel, title, nameLabelX, nameLabelY, position) VALUES
(15, 4, 'Infraestructura de seguridad vial', 'Comportamiento de Infraestructura de seguridad vial', 'Año', 'Índice', 1),
(16, 4, 'Dispositivos viales operativos', 'Comportamiento de Dispositivos viales operativos', 'Año', 'Cantidad', 2),
(17, 4, 'Infraestructura en mantenimiento', 'Comportamiento de Infraestructura en mantenimiento', 'Año', 'Ítems', 3),
(18, 4, 'Presupuesto mantenimiento de infraestructura', 'Comportamiento de Presupuesto para mantenimiento', 'Año', 'Soles', 4);

-- Modelo: Eficiencia_de_movilidad
INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel, title, nameLabelX, nameLabelY, position) VALUES
(19, 5, 'Poblacion que utiliza aplicaciones de transporte', 'Comportamiento de Población que usa apps de transporte', 'Año', 'Personas', 1),
(20, 5, 'Tasa de vehiculos en circulacion', 'Comportamiento de Total de vehículos en circulación', 'Año', 'Vehículos', 2),
(21, 5, 'Extorsiones a transportistas', 'Comportamiento de Extorsiones a transportistas (movilidad)', 'Año', 'Casos', 3),
(22, 5, 'Total de infracciones', 'Comportamiento de Total de infracciones', 'Año', 'Infracciones', 4),
(23, 5, 'Eficiencia de movilidad', 'Comportamiento de Eficiencia de movilidades', 'Año', 'Índice', 5);