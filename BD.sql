-- Crear la base de datos
CREATE DATABASE sistema_de_finanzas;

-- Usar la base de datos
USE sistema_de_finanzas;

-- Crear la tabla de catálogo de clasificaciones
CREATE TABLE catalogo_clasificacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clasificacion VARCHAR(50) NOT NULL
);

-- Insertar valores iniciales en el catálogo
INSERT INTO catalogo_clasificacion (clasificacion)
VALUES ('Bueno'), ('Malo');

-- Crear la tabla de gastos
CREATE TABLE gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    concepto VARCHAR(255) NOT NULL,
    clasificacion_id INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    fecha DATE NOT NULL,
    forma_pago VARCHAR(50) NOT NULL,
    entidad VARCHAR(255) NOT NULL,
    es_deducible BOOLEAN NOT NULL,
    FOREIGN KEY (clasificacion_id) REFERENCES catalogo_clasificacion(id)
);
