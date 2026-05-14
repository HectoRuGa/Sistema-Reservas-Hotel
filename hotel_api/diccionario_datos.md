# Diccionario de Datos - Sistema de Reservas de Hotel

Este documento describe la estructura de la base de datos del sistema de reservas de hotel, incluyendo tablas, columnas, tipos de datos, restricciones y relaciones.

## Tabla: clientes

**Descripción**: Almacena la información básica de los clientes registrados en el sistema.

| Columna    | Tipo      | Restricciones          | Descripción |
|------------|-----------|------------------------|-------------|
| id         | Integer   | Primary Key, Index     | Identificador único del cliente |
| nombre     | String    | Not Null               | Nombre completo del cliente |
| correo     | String    | Unique                 | Correo electrónico del cliente |
| telefono   | String    | -                      | Número de teléfono del cliente |

## Tabla: habitaciones

**Descripción**: Contiene información sobre las habitaciones disponibles en el hotel.

| Columna    | Tipo      | Restricciones          | Descripción |
|------------|-----------|------------------------|-------------|
| id         | Integer   | Primary Key, Index     | Identificador único de la habitación |
| tipo       | String    | Not Null               | Tipo de habitación (ej: simple, doble, suite) |
| estado     | String    | Default "disponible"   | Estado actual de la habitación (disponible, ocupada, mantenimiento) |
| precio     | Float     | -                      | Precio por noche de la habitación |

## Tabla: reservas

**Descripción**: Registra las reservas realizadas por los clientes para habitaciones específicas.

| Columna          | Tipo      | Restricciones                      | Descripción |
|------------------|-----------|------------------------------------|-------------|
| id               | Integer   | Primary Key, Index                 | Identificador único de la reserva |
| cliente_id       | Integer   | Foreign Key (clientes.id), Not Null| ID del cliente que realiza la reserva |
| habitacion_id    | Integer   | Foreign Key (habitaciones.id), Not Null| ID de la habitación reservada |
| fecha_entrada    | Date      | -                                  | Fecha de entrada programada |
| fecha_salida     | Date      | -                                  | Fecha de salida programada |
| fecha_check_in   | DateTime  | -                                  | Fecha y hora real del check-in |
| fecha_check_out  | DateTime  | -                                  | Fecha y hora real del check-out |
| estado           | String    | Default "pendiente"                | Estado de la reserva (pendiente, confirmada, cancelada, completada) |
| fecha_creacion   | DateTime  | Default current timestamp          | Fecha y hora de creación de la reserva |

## Tabla: consumos

**Descripción**: Registra los consumos adicionales (minibar, servicios, etc.) durante la estadía del cliente.

| Columna      | Tipo      | Restricciones                      | Descripción |
|--------------|-----------|------------------------------------|-------------|
| id           | Integer   | Primary Key, Index                 | Identificador único del consumo |
| reserva_id   | Integer   | Foreign Key (reservas.id), Not Null| ID de la reserva asociada |
| descripcion  | String    | Not Null                           | Descripción del consumo |
| monto        | Float     | Not Null                           | Monto del consumo |
| fecha        | DateTime  | Default current timestamp          | Fecha y hora del consumo |

## Tabla: facturas

**Descripción**: Contiene las facturas generadas por las reservas, incluyendo cargos por habitación y consumos.

| Columna          | Tipo      | Restricciones                      | Descripción |
|------------------|-----------|------------------------------------|-------------|
| id               | Integer   | Primary Key, Index                 | Identificador único de la factura |
| reserva_id       | Integer   | Foreign Key (reservas.id), Not Null| ID de la reserva facturada |
| fecha_emision    | DateTime  | Default current timestamp          | Fecha y hora de emisión de la factura |
| cargo_habitacion | Float     | Default 0                          | Cargo por la habitación |
| consumos_total   | Float     | Default 0                          | Total de consumos adicionales |
| total            | Float     | Default 0                          | Total de la factura |
| estado           | String    | Default "pendiente"                | Estado de la factura (pendiente, pagada, cancelada) |
| metodo_pago      | String    | -                                  | Método de pago utilizado |

## Relaciones entre Tablas

- **clientes** → **reservas**: Un cliente puede tener múltiples reservas (1:N)
- **habitaciones** → **reservas**: Una habitación puede tener múltiples reservas (1:N)
- **reservas** → **consumos**: Una reserva puede tener múltiples consumos (1:N)
- **reservas** → **facturas**: Una reserva tiene una factura (1:1)

## Notas Adicionales

- La base de datos utiliza SQLite por defecto, pero puede migrarse a MySQL/PostgreSQL.
- Las fechas se almacenan en formato UTC.
- Los estados de las entidades (habitaciones, reservas, facturas) siguen convenciones específicas definidas en el código.
- Las claves foráneas aseguran la integridad referencial de los datos.