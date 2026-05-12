# OpsCore Incidents

Sistema de gestión de incidentes para planta industrial.

## Objetivo

Permitir que operadores reporten incidentes desde dispositivos móviles, que supervisores asignen responsables, que técnicos registren soluciones y que gerentes analicen patrones y causas raíz recurrentes.

## Stack inicial

- Python
- Django
- Django REST Framework
- SQLite en desarrollo
- PostgreSQL en una futura etapa productiva

## Estado actual

Base inicial del proyecto. Sin lógica de negocio implementada.
- Inicialización de Django
- Instalación y registro de REST Framework

# 1. Desde la raíz
docker compose up -d db

# 2. Entrar al backend
cd backend

# 3. Crear entorno virtual
python -m venv .venv

# 4. Activar entorno
# Windows:
.venv\Scripts\activate

# Mac/Linux:
source .venv/bin/activate

# 5. Instalar dependencias
pip install -r requirements/base.txt

# 6. Copiar variables
cp .env.example .env

# 7. Crear migraciones
python manage.py makemigrations users
python manage.py makemigrations incidents

# 8. Crear tablas en PostgreSQL
python manage.py migrate

# 9. Crear usuario admin
python manage.py createsuperuser
#superuser: username (A preferencia 'admin')
#superuser: password (opscore_password)
#superuser: email (A preferencia)

# 10. Levantar backend
python manage.py runserver

# 11. Ejecutar pre-data
python manage.py loaddata initial_data