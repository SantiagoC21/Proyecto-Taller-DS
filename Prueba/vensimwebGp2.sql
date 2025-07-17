CREATE DATABASE IF NOT EXISTS vensimWebgp3;
USE vensimWebgp3; 

CREATE TABLE IF NOT EXISTS model(
  idModel INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(500) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS diagramaForrester(
  idForrester INT PRIMARY KEY AUTO_INCREMENT,
  idModel INT NOT NULL,
  idArchivo VARCHAR(500),
  FOREIGN KEY (idModel) REFERENCES model(idModel) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS diagramaCausal(
  idCausal INT PRIMARY KEY AUTO_INCREMENT,
  idModel INT NOT NULL,
  idArchivo VARCHAR(500),
  FOREIGN KEY (idModel) REFERENCES model(idModel) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS variableCausal (
  idVariableCausal INT PRIMARY KEY AUTO_INCREMENT,
  idCausal INT NOT NULL,
  nombre VARCHAR(200),
  titulo VARCHAR(200),
  unidad VARCHAR(100),
  x_pos INT,
  y_pos INT,
  FOREIGN KEY (idCausal) REFERENCES diagramaCausal (idCausal) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ConexionCausal (
  idConexionCausal INT PRIMARY KEY AUTO_INCREMENT,
  idCausal INT NOT NULL,
  idOrigen INT NOT NULL,
  idDestino INT NOT NULL,
  polaridad VARCHAR (100),
  x_curve REAL,
  y_curve REAL,
  FOREIGN KEY (idCausal) REFERENCES diagramaCausal (idCausal) ON DELETE CASCADE,
  FOREIGN KEY (idOrigen) REFERENCES variableCausal (idVariableCausal),
  FOREIGN KEY (idDestino) REFERENCES variableCausal (idVariableCausal)
);

CREATE TABLE IF NOT EXISTS SubModel (
  idSubmodel INT PRIMARY KEY AUTO_INCREMENT,
  idForrester INT NOT NULL,
  nombre VARCHAR (500),
  UNIQUE (idForrester, nombre),
  FOREIGN KEY (idForrester) REFERENCES diagramaForrester (idForrester) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS variableForrester (
  idVariableForrester INT PRIMARY KEY AUTO_INCREMENT,
  idSubmodel INT NOT NULL,
  nombre VARCHAR(200),
  titulo VARCHAR(200),
  tipo VARCHAR(100),
  unidad VARCHAR(100),
  tiempo VARCHAR(100),
  x_pos REAL,
  y_pos REAL,
  FOREIGN KEY (idSubmodel) REFERENCES SubModel (idSubmodel) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ConexionForrester (
  idConexionForrester INT PRIMARY KEY AUTO_INCREMENT,
  idForrester INT NOT NULL,
  idOrigen INT NOT NULL,
  idDestino INT NOT NULL,
  x_curve REAL,
  y_curve REAL,
  FOREIGN KEY (idForrester) REFERENCES diagramaForrester (idForrester) ON DELETE CASCADE,
  FOREIGN KEY (idOrigen) REFERENCES variableForrester (idVariableForrester) ON DELETE CASCADE,
  FOREIGN KEY (idDestino) REFERENCES variableForrester (idVariableForrester) ON DELETE CASCADE
);



INSERT IGNORE INTO model (idModel, nameModel) VALUES
(1,'Frecuencia de mantenimiento'),
(2,'Satisfaccion de autoridades'),
(3,'Satisfaccion de usuario'),
(4,'Seguridad vial'),
(5,'Eficiencia de movilidad');

INSERT IGNORE INTO diagramaForrester (idForrester, idModel, idArchivo) VALUES
(1,1,'frecuencia-de-mantenimiento-forrester.mdl'),
(2,2,'satisfaccion_autoridades-forrester.mdl'),
(3,3,'satisfaccion-usuario-forrester.mdl'),
(4,4,'seguridad-vial-forrester.mdl'),
(5,5,'eficiencia-de-movilidad-forrester.mdl');

INSERT IGNORE INTO diagramaCausal (idCausal, idModel, idArchivo) VALUES
(1,1,'frecuencia-de-mantenimiento-causal.mdl'),
(2,2,'satisfacción-de-autoridades-causal.mdl'),
(3,3,'satisfaccion-usuario-causal.mdl'),
(4,4,'seguridad-vial-causal.mdl'),
(5,5,'eficiencia-movilidad-causal.mdl');






