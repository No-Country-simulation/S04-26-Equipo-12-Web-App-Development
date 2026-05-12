# OpsCore Backend

Backend del sistema **OpsCore**, desarrollado con **Django** y **Django REST Framework**.

Este backend gestiona autenticación, usuarios, roles, áreas, máquinas, tipos de incidentes, registro de incidentes, asignaciones, resoluciones y auditoría del ciclo de vida de cada incidente.

---

## 1. Stack tecnológico

- Python
- Django
- Django REST Framework
- PostgreSQL
- Simple JWT
- django-filter
- django-cors-headers
- Docker
- Docker Compose

---

## 2. Estado actual

Base inicial del backend configurada.

Incluye:

- Configuración modular de settings
- Integración con Django REST Framework
- Conexión con PostgreSQL
- Modelo de usuario personalizado
- Modelos iniciales para gestión de incidentes
- Migraciones iniciales
- Registro de modelos en Django Admin
- Configuración inicial con Docker

---

## 3. Estructura principal

```txt
backend/
│
├── apps/
│   ├── users/
│   ├── incidents/
│   └── analytics/
│
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── dev.py
│   │   └── prod.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── core/
├── requirements/
│   └── base.txt
│
├── manage.py
├── Dockerfile
├── .env.example
└── README.md
```

---

# Fase 1: Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Docker Desktop
- Docker Compose
- Git

Verificar Docker:

```bash
docker --version
docker compose version
```

---

# Fase 2: Variables de entorno

El archivo `.env` no debe subirse al repositorio.

Para desarrollo con Docker, el backend debe usar el host de base de datos `db`, porque ese es el nombre del servicio PostgreSQL dentro de Docker Compose.

Ejemplo recomendado para `backend/.env.example`:

```env
SECRET_KEY=dev-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend

DB_NAME=opscore_db
DB_USER=opscore_user
DB_PASSWORD=opscore_password
DB_HOST=db
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

> Importante: dentro de Docker, `DB_HOST` debe ser `db`, no `localhost`.

---

# Fase 3: Levantar el proyecto con Docker

Desde la raíz del repositorio:

```bash
docker compose up --build
```

Para ejecutar los servicios en segundo plano:

```bash
docker compose up --build -d
```

---

# Fase 4: Verificar servicios activos

Desde la raíz del repositorio:

```bash
docker compose ps
```

Deberían aparecer servicios como:

```txt
opscore_postgres
opscore_backend
opscore_frontend
```

---

# Fase 5: Ejecutar migraciones

Una vez levantados los contenedores, ejecutar las migraciones dentro del contenedor del backend:

```bash
docker compose exec backend python manage.py migrate
```

Esto creará las tablas necesarias en PostgreSQL.

---

# Fase 6: Crear superusuario

Crear un usuario administrador para acceder al Django Admin:

```bash
docker compose exec backend python manage.py createsuperuser
```

Datos sugeridos para desarrollo:

```txt
Username: opscore_admin
Email: admin@gmail.com(Email a preferencia)
Password: opscore_password(Ejemplo)
```

---

# Fase 7: Cargar datos iniciales

Cargar los datos base del sistema:

```bash
docker compose exec backend python manage.py loaddata initial_data
```

Estos datos incluen catálogos iniciales como áreas, tipos de incidentes.

---

# Fase 8: Accesos principales

Backend:

```txt
http://127.0.0.1:8000/
```

Django Admin:

```txt
http://127.0.0.1:8000/admin/
```

Frontend:

```txt
http://127.0.0.1:5173/
```

---

# Fase 9: Comandos útiles con Docker

## Levantar servicios

```bash
docker compose up --build
```

## Levantar servicios en segundo plano

```bash
docker compose up --build -d
```

## Ver contenedores activos

```bash
docker compose ps
```

## Ver logs del backend

```bash
docker compose logs backend
```

## Ver logs de PostgreSQL

```bash
docker compose logs db
```

## Entrar al contenedor del backend

```bash
docker compose exec backend bash
```

## Ejecutar check de Django

```bash
docker compose exec backend python manage.py check
```

## Crear migraciones

```bash
docker compose exec backend python manage.py makemigrations
```

## Aplicar migraciones

```bash
docker compose exec backend python manage.py migrate
```

## Ver historial de migraciones

```bash
docker compose exec backend python manage.py showmigrations
```

## Entrar al shell de Django

```bash
docker compose exec backend python manage.py shell
```

## Entrar a PostgreSQL desde Django

```bash
docker compose exec backend python manage.py dbshell
```

Dentro de PostgreSQL:

```sql
\dt
```

Salir de PostgreSQL:

```sql
\q
```

---

# Fase 10: Detener servicios

Detener contenedores:

```bash
docker compose down
```

Detener contenedores y eliminar el volumen de PostgreSQL:

```bash
docker compose down -v
```

> Advertencia: `docker compose down -v` elimina los datos almacenados en PostgreSQL. Después de usarlo, será necesario volver a ejecutar migraciones y cargar datos iniciales.

---

# Fase 11: Flujo recomendado para nuevos integrantes

Desde la raíz del repositorio:

```bash
docker compose up --build -d
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py loaddata initial_data
docker compose exec backend python manage.py createsuperuser
```

Luego abrir:

```txt
http://127.0.0.1:8000/admin/
```

---

# Fase 12: Troubleshooting

## Error: Docker no está corriendo

Si aparece un error similar a:

```txt
failed to connect to the docker API
dockerDesktopLinuxEngine
```

Solución:

1. Abrir Docker Desktop.
2. Esperar a que el motor esté corriendo.
3. Ejecutar nuevamente:

```bash
docker compose up --build
```

---

## Error: el backend no conecta con PostgreSQL

Verificar que el backend esté usando:

```env
DB_HOST=db
```

No debe usar:

```env
DB_HOST=localhost
```

Dentro de Docker, `localhost` apunta al mismo contenedor del backend, no al contenedor de PostgreSQL.

---

## Error: Docker no encuentra `requirements`

Verificar que exista:

```txt
backend/requirements/base.txt
```

El Dockerfile espera esta estructura:

```txt
backend/
├── Dockerfile
├── requirements/
│   └── base.txt
├── manage.py
├── apps/
├── config/
└── core/
```

---

## Error: `No installed app with label 'users'`

Verificar que `manage.py` esté usando el settings correcto:

```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
```

También verificar que la app esté registrada en `INSTALLED_APPS`:

```python
'apps.users.apps.UsersConfig',
```

---

## Error: `Settings object has no attribute ROOT_URLCONF`

Verificar que en `config/settings/base.py` exista:

```python
ROOT_URLCONF = 'config.urls'
```

También verificar que exista:

```txt
config/urls.py
```

---

# Fase 13: Convenciones del backend

## Idioma del código

El código del backend se maneja en inglés.

Ejemplo:

```python
class Status(models.TextChoices):
    OPEN = 'OPEN'
    IN_PROGRESS = 'IN_PROGRESS'
    CLOSED = 'CLOSED'
    CANCELLED = 'CANCELLED'
```

---

## Apps principales

```txt
users
incidents
analytics
core
```

---

## Modelos principales

```txt
CustomUser
Area
IncidentType
Machine
Incident
IncidentAssignment
Resolution
IncidentLog
```

---

## Variables de entorno

Las variables de entorno usan `SCREAMING_SNAKE_CASE`.

Ejemplo:

```env
DB_NAME=opscore_db
DB_USER=opscore_user
DB_PASSWORD=opscore_password
DB_HOST=db
DB_PORT=5432
```

---

# Fase 14: Notas importantes

- El archivo `.env` no debe subirse al repositorio.
- El archivo `.env.example` sí debe versionarse.
- Las migraciones sí deben subirse al repositorio.
- El Django Admin se usa como herramienta interna de desarrollo.
- La interfaz final del sistema será consumida desde el frontend mediante la API REST.
- El entorno oficial de desarrollo del proyecto se levanta con Docker.
- Si se elimina el volumen de PostgreSQL, será necesario volver a ejecutar migraciones y cargar datos iniciales.

---