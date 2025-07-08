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
CREATE TABLE IF NOT EXISTS submodel(
  idSubmodel INT AUTO_INCREMENT PRIMARY KEY,
  idModel INT NOT NULL,
  nameSubmodel VARCHAR(200) UNIQUE NOT NULL,
  UNIQUE (nameSubmodel),
  FOREIGN KEY (idModel) REFERENCES model(idModel) ON DELETE CASCADE
);
-- Tabla: Variables

CREATE TABLE IF NOT EXISTS variables(
  idVariable INT AUTO_INCREMENT PRIMARY KEY,
  idSubmodel INT NOT NULL,
  nameVariable VARCHAR(200) NOT NULL,
  title VARCHAR(200),
  timee VARCHAR(100),
  unit VARCHAR(100),
  position INT DEFAULT 0,
  FOREIGN KEY (idSubmodel) REFERENCES submodel(idSubmodel) ON DELETE CASCADE
);

-- Insertar modelos principales
INSERT IGNORE INTO model (idModel, nameModel) VALUES
(1, 'Frecuencia de mantenimiento'),
(2, 'Satisfaccion de autoridades'),
(3, 'Satisfaccion de usuario'),
(4, 'Seguridad vial'),
(5, 'Eficiencia de movilidad');

INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel) VALUES
(1, 1, 'Cantidad de fallas mecanicas'),
(2, 1, 'Disponibilidad de la flota'),
(3, 1, 'Cantidad de vehiculos en operacion'),
(4, 1, 'Disponibilidad de talleres')

INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel) VALUES
(5, 2, 'Inversion en infraestructura'),
(6, 2, 'Calidad de infraestructura vial'),
(7, 2, 'Accidentes de tránsito'),
(8, 2, 'Confianza pública')
(9, 2, 'Imagen pública de autoridades')

INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel) VALUES
(10, 3, 'Cantidad de fallas mecanicas'),
(11, 3, 'Cantidad de fallas mecanicas'),
(12, 3, 'Cantidad de fallas mecanicas'),
(13, 3, 'Cantidad de fallas mecanicas'),
(14, 3, 'Cantidad de fallas mecanicas'),
(15, 3, 'Cantidad de fallas mecanicas')

INSERT IGNORE INTO submodel (idSubmodel, idModel, nameSubmodel) VALUES
(13, 1, 'Cantidad de fallas mecanicas'),
(, 1, 'Disponibilidad de la flota'),
(3, 1, 'Cantidad de vehiculos en operacion'),
(4, 1, 'Disponibilidad de talleres')