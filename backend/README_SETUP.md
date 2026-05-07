# Backend Professional Setup

## 1. Crear entorno virtual

Windows:
venv\Scripts\activate

## 2. Instalar dependencias

pip install -r requirements.txt

## 3. Configurar .env

Renombrar:
.env.example -> .env

## 4. Ejecutar servidor

uvicorn app.main:app --reload

## 5. Abrir Swagger

http://127.0.0.1:8000/docs
