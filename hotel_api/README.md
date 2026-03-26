# Hotel API - Sistema de Reservas

API backend desarrollada en Python con FastAPI para la gestión de clientes y habitaciones en un sistema de reservas de hotel.

## Tecnologías utilizadas
- Python
- FastAPI
- SQLAlchemy
- SQLite (puede migrarse a MySQL/PostgreSQL)
- Uvicorn

## Estructura del proyecto


hotel_api/
│
├── app/
│   ├── main.py
│   │
│   ├── database/
│   │   └── connection.py
│   │
│   ├── models/
│   │   ├── cliente.py
│   │   └── habitacion.py
│   │
│   ├── schemas/
│   │   ├── cliente.py
│   │   └── habitacion.py
│   │
│   └── routes/
│       ├── clientes.py
│       └── habitaciones.py
│
├── requirements.txt
├── .env
└── README.md


## Instalación

1. Clonar el repositorio:


git clone <en progreso>
cd hotel_api


2. Crear entorno virtual:


python -m venv venv
venv\Scripts\activate # Windows


3. Instalar dependencias:


pip install -r requirements.txt


## Ejecución


uvicorn app.main:app --reload


## Documentación de la API

Abrir en navegador:


http://127.0.0.1:8000/docs


## Endpoints principales

### Clientes
- POST /clientes → Crear cliente
- GET /clientes → Listar clientes
- PUT /clientes/{id} → Editar cliente

### Habitaciones
- POST /habitaciones → Crear habitación
- GET /habitaciones → Listar habitaciones
- PUT /habitaciones/{id} → Editar habitación

## Base de datos

Actualmente usa SQLite:


hotel.db


## Próximas mejoras
- Autenticación JWT
- Módulo de reservas
- Integración con MySQL
- Dockerización

## Autor
Equipo 5 - Sistema de Reservas de Hotel