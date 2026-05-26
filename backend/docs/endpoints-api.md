# Documentación de Endpoints — Backend API

**Base URL:** `/api/v1`

**Autenticación:** JWT (Bearer token) vía `Authorization: Bearer <access_token>`.  
**Formato de respuesta errores:** `{ "success": false, "status_code": <int>, "message": "<str>", "errors": {...} }`

---

## Índice

1. [Autenticación (`/api/v1/auth/`)](#1-autenticación)
2. [Usuarios (`/api/v1/auth/users/`)](#2-usuarios)
3. [Incidencias (`/api/v1/incidents/`)](#3-incidencias)
4. [Archivos (`/api/v1/incidents/{incident_pk}/files/`)](#4-archivos)
5. [Analíticas (`/api/v1/analytics/`)](#5-analíticas)

---

## 1. Autenticación

### 1.1 `POST /api/v1/auth/login/`

Inicia sesión con email y contraseña. Retorna tokens JWT + perfil del usuario.

- **Permiso:** `AllowAny`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "email": "string (formato email, obligatorio)",
  "password": "string (obligatorio)"
}
```

- **Respuesta 200:**

```json
{
  "access": "string (JWT access token)",
  "refresh": "string (JWT refresh token)",
  "user": {
    "id": "int",
    "full_name": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "role": "string (OPERATOR|SUPERVISOR|MANAGER|ADMIN)",
    "phone": "string",
    "employee_code": "string",
    "area": "int | null",
    "area_name": "string | null",
    "is_active": "boolean",
    "created_at": "datetime"
  }
}
```

---

### 1.2 `POST /api/v1/auth/register-operator/`

Registra un nuevo usuario con rol `OPERATOR`. Genera código de empleado automático (`EMP-XXXX`).

- **Permiso:** `AllowAny`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "email": "string (formato email, obligatorio)",
  "first_name": "string (obligatorio)",
  "last_name": "string (obligatorio)",
  "password": "string (mín. 8, máx. 30 caracteres, obligatorio)",
  "phone": "string (opcional)"
}
```

- **Respuesta 201:**

```json
{
  "message": "User registered successfully",
  "user": { "... perfil del usuario ..." },
  "tokens": {
    "refresh": "string",
    "access": "string"
  }
}
```

---

### 1.3 `POST /api/v1/auth/refresh/`

Renueva el access token usando el refresh token.

- **Permiso:** `AllowAny`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "refresh": "string (refresh token, obligatorio)"
}
```

- **Respuesta 200:**

```json
{
  "access": "string (nuevo access token)"
}
```

---

### 1.4 `POST /api/v1/auth/logout/`

Invalida (blacklist) el refresh token para cerrar sesión.

- **Permiso:** `IsAuthenticated`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "refresh": "string (refresh token a invalidar, obligatorio)"
}
```

- **Respuesta 200:** `{ "message": "Logout successful" }`
- **Errores:** `400` — `{ "message": "Token is invalid or expired" }`

---

### 1.5 `GET /api/v1/auth/me/`

Retorna el perfil completo del usuario autenticado.

- **Permiso:** `IsAuthenticated`
- **Headers:** `Authorization: Bearer <access_token>`
- **Body:** No requiere
- **Respuesta 200:**

```json
{
  "id": "int",
  "full_name": "string",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "role": "string (OPERATOR|SUPERVISOR|MANAGER|ADMIN)",
  "phone": "string",
  "employee_code": "string",
  "area": "int | null",
  "area_name": "string | null",
  "is_active": "boolean",
  "created_at": "datetime"
}
```

---

## 2. Usuarios

Todas las rutas de usuarios requieren autenticación.  
Los usuarios no se eliminan físicamente (no hay `DELETE`); se desactivan vía `is_active=False`.

---

### 2.1 `GET /api/v1/auth/users/`

Lista los usuarios del sistema.

- **Permiso:** `IsAuthenticated` + `IsAdminOrSupervisorOrManager`
  - **ADMIN:** ve todos los usuarios (excepto otros ADMINs)
  - **SUPERVISOR:** ve solo OPERATORs
  - **MANAGER:** ve OPERATORs y SUPERVISORs
  - **OPERATOR:** no tiene acceso
- **Headers:** `Authorization: Bearer <access_token>`
- **Respuesta 200:**

```json
[
  {
    "id": "int",
    "full_name": "string",
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "role": "string (OPERATOR|SUPERVISOR|MANAGER|ADMIN)",
    "phone": "string",
    "employee_code": "string",
    "area": "int | null",
    "area_name": "string | null",
    "is_active": "boolean",
    "created_at": "datetime"
  }
]
```

---

### 2.2 `POST /api/v1/auth/users/`

Crea un nuevo usuario.

- **Permiso:** `IsAuthenticated` + `IsAdminOrSupervisor`
  - **SUPERVISOR:** solo puede crear OPERATORs
  - **ADMIN:** puede crear OPERATOR, SUPERVISOR y MANAGER (no ADMIN)
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "email": "string (formato email, obligatorio)",
  "first_name": "string (obligatorio)",
  "last_name": "string (obligatorio)",
  "password": "string (mín. 8, máx. 30, obligatorio)",
  "role": "string (OPERATOR|SUPERVISOR|MANAGER, obligatorio)",
  "area": "int (ID de Area, opcional)",
  "phone": "string (opcional)",
  "employee_code": "string (opcional)"
}
```

- **Respuesta 201:** Objeto de usuario creado (`UserProfileSerializer`)

---

### 2.3 `GET /api/v1/auth/users/{id}/`

Obtiene el detalle de un usuario específico.

- **Permiso:** `IsAuthenticated` + `IsAdminOrSupervisorOrManager`
- **Parámetros de ruta:** `id` (int) — ID del usuario
- **Headers:** `Authorization: Bearer <access_token>`
- **Respuesta 200:** Objeto de usuario (`UserProfileSerializer`)

---

### 2.4 `PATCH /api/v1/auth/users/{id}/`

Actualiza parcialmente un usuario.

- **Permiso:** `IsAuthenticated`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):** Campos a actualizar (todos opcionales)

```json
{
  "first_name": "string (opcional)",
  "last_name": "string (opcional)",
  "phone": "string (opcional)",
  "area": "int (opcional)"
}
```

- **Respuesta 200:** Objeto de usuario actualizado

---

### 2.5 `PATCH /api/v1/auth/users/{id}/update-role/`

Cambia el rol de un usuario entre `OPERATOR` y `SUPERVISOR`.

- **Permiso:** `IsAuthenticated` + `IsAdmin`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "role": "string (OPERATOR|SUPERVISOR, obligatorio)"
}
```

- **Respuesta 200:**

```json
{
  "code": "USER_ROLE_UPDATED",
  "old_role": "string",
  "new_role": "string",
  "user": { "... perfil del usuario ..." }
}
```

---

## 3. Incidencias

Todas las rutas de incidencias requieren autenticación.

**Headers comunes:** `Authorization: Bearer <access_token>`  
**Paginación:** `?page=<int>&page_size=<int>` (default page_size=10, max 100)  
**Respuesta paginada:**

```json
{
  "success": true,
  "count": "int",
  "total_pages": "int",
  "current_page": "int",
  "next": "url | null",
  "previous": "url | null",
  "results": [ "... objetos ..." ]
}
```

**Filtros disponibles (vía query params):** `status`, `priority`, `area`, `machine`, `type`  
**Ordenamiento (vía `?ordering=`):** `created_at`, `-created_at`, `resolved_at`, `-resolved_at`, `priority`, `-priority`, `status`, `-status`

---

### 3.1 `GET /api/v1/incidents/`

Lista las incidencias asignadas al usuario autenticado.

- **Permiso:** `IsAuthenticated`
- **Query params opcionales:** `page`, `page_size`, `status`, `priority`, `area`, `machine`, `type`, `ordering`
- **Respuesta:** Paginada con objetos de incidencia detallados

---

### 3.2 `POST /api/v1/incidents/`

Crea una nueva incidencia. `reported_by` se asigna automáticamente al usuario autenticado.  
El `status` se asigna automáticamente como `OPEN`.

- **Permiso:** `IsAuthenticated` + `IsOperator` (solo OPERATOR puede crear)
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "title": "string (máx. 200, obligatorio)",
  "description": "string (obligatorio)",
  "area": "int (ID de Area, obligatorio)",
  "machine": "int (ID de Machine, opcional)",
  "type": "int (ID de IncidentType, obligatorio)",
  "priority": "string (opcional, default: MEDIUM)"
}
```

- **Valores de `priority`:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **Respuesta 201:** Objeto de incidencia creada (con `IncidentDetailSerializer`)

---

### 3.3 `GET /api/v1/incidents/{id}/`

Obtiene el detalle completo de una incidencia específica.

- **Permiso:** `IsAuthenticated`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Respuesta 200:**

```json
{
  "id": "int",
  "title": "string",
  "description": "string",
  "status": "string (OPEN|IN_PROGRESS|CLOSED|CANCELLED)",
  "priority": "string (LOW|MEDIUM|HIGH|CRITICAL)",
  "root_cause": "string",
  "solution": "string",
  "created_at": "datetime",
  "updated_at": "datetime",
  "resolved_at": "datetime|null",
  "resolution_time_minutes": "int|null",
  "reported_by": { "id": "int", "full_name": "string", "role": "string" },
  "assigned_to": { "id": "int", "full_name": "string", "role": "string" } | null,
  "area": { "id": "int", "name": "string", "description": "string" },
  "machine": { "id": "int", "name": "string", "machine_code": "string", "area": "int" } | null,
  "type": { "id": "int", "name": "string", "description": "string" }
}
```

---

### 3.4 `PATCH /api/v1/incidents/{id}/change-status/`

Cambia el estado de una incidencia. Solo el usuario asignado puede cambiar el estado.  
Si se cambia a `CLOSED`, se asigna automáticamente `resolved_at`. Si se cambia a otro estado, `resolved_at` se limpia.

- **Permiso:** `IsAuthenticated` + `IsAssignedToIncident`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Body (JSON):**

```json
{
  "status": "string (OPEN|IN_PROGRESS|CLOSED, obligatorio)"
}
```

- **Transiciones válidas:** OPEN → IN_PROGRESS → CLOSED (CANCELLED no se puede asignar desde este endpoint)
- **Respuesta 200:** Objeto de incidencia actualizado (`IncidentDetailSerializer`)
- **Error 400:** `{ "status": ["El incidente ya se encuentra en ese estado."] }`

---

## 4. Archivos

Rutas anidadas dentro de una incidencia (`/api/v1/incidents/{incident_pk}/files/`).

---

### 4.1 `GET /api/v1/incidents/{incident_pk}/files/`

Lista todos los archivos adjuntos a una incidencia.

- **Permiso:** No requiere autenticación explícita (público de facto)
- **Parámetros de ruta:** `incident_pk` (int) — ID de la incidencia
- **Respuesta 200:**

```json
[
  {
    "id": "int",
    "file": "url (archivo)",
    "file_type": "string (image|video)",
    "mime_type": "string",
    "size_bytes": "int",
    "uploaded_at": "datetime"
  }
]
```

---

### 4.2 `POST /api/v1/incidents/{incident_pk}/files/`

Sube un archivo (imagen o video) a una incidencia.

- **Permiso:** No requiere autenticación explícita (público de facto)
- **Headers:** `Content-Type: multipart/form-data`
- **Parámetros de ruta:** `incident_pk` (int) — ID de la incidencia
- **Body (form-data):**

| Campo  | Tipo | Obligatorio | Descripción     |
|--------|------|-------------|-----------------|
| `file` | File | Sí          | Archivo a subir |

- **Tipos MIME permitidos:**

| Tipo    | MIME types                                               | Tamaño máximo |
|---------|----------------------------------------------------------|---------------|
| Imagen  | `image/jpeg`, `image/png`, `image/webp`                  | 5 MB          |
| Video   | `video/mp4`, `video/quicktime`, `video/x-msvideo`        | 200 MB        |

- **Respuesta 201:**

```json
{
  "id": "int",
  "file": "url (archivo subido)",
  "file_type": "string (image|video)",
  "mime_type": "string",
  "size_bytes": "int",
  "uploaded_at": "datetime"
}
```

---

## 5. Analíticas

Endpoints para métricas y exportación de reportes. Solo accesibles por usuarios con rol `MANAGER`.

---

### 5.1 `GET /api/v1/analytics/metrics/`

Retorna un resumen de métricas generales.

- **Permiso:** `IsAuthenticated` + `IsManager`
- **Headers:** `Authorization: Bearer <access_token>`
- **Query params opcionales:** `start_date` (YYYY-MM-DD), `end_date` (YYYY-MM-DD)
- **Respuesta 200:**

```json
{
  "avg_response_time": [
    { "area_name": "string", "avg_minutes": "float" }
  ],
  "avg_resolution_time": [
    { "area_name": "string", "avg_minutes": "float" }
  ],
  "resolution_rate": {
    "total": "int",
    "closed": "int",
    "rate": "float (porcentaje)"
  },
  "incidents_by_area": [
    { "area_name": "string", "count": "int" }
  ],
  "root_cause_frequency": [
    { "type_name": "string", "root_cause": "string", "count": "int" }
  ],
  "critical_incidents_over_time": [
    { "date": "string (YYYY-MM-DD)", "count": "int" }
  ]
}
```

---

### 5.2 `GET /api/v1/analytics/reports/export/`

Exporta un reporte en formato Excel (`.xlsx`) o texto plano (`.txt`).

- **Permiso:** `IsAuthenticated` + `IsManager`
- **Headers:** `Authorization: Bearer <access_token>`
- **Query params:**

| Parámetro     | Tipo   | Obligatorio | Descripción                                | Valores                            |
|---------------|--------|-------------|--------------------------------------------|------------------------------------|
| `source`      | string | No          | Origen de los datos                        | `metrics` (default), `history`, `filtered` |
| `format`      | string | No          | Formato de exportación                     | `excel` (default), `pdf`           |
| `start_date`  | string | No          | Fecha inicial (YYYY-MM-DD)                 |                                    |
| `end_date`    | string | No          | Fecha final (YYYY-MM-DD)                   |                                    |
| `area`        | int    | No          | Filtrar por área (solo source=filtered)    |                                    |
| `type`        | int    | No          | Filtrar por tipo (solo source=filtered)    |                                    |
| `status`      | string | No          | Filtrar por estado (solo source=filtered)  |                                    |
| `priority`    | string | No          | Filtrar por prioridad (solo source=filtered)|                                   |

- **Respuesta 200:** Archivo binario (descarga)
  - `Content-Type`: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` (excel) o `text/plain` (pdf)
  - `Content-Disposition`: `attachment; filename="reporte_{source}.(xlsx|txt)"`

---

## 6. Django Admin

- **URL:** `/admin/`
- **Autenticación:** Django admin (separada del JWT)
- **Modelos registrados:** Area, IncidentType, Machine, Incident, IncidentAssignment, Resolution, IncidentLog

---

## 7. Modelos de Datos (Referencia Rápida)

### `CustomUser`
| Campo          | Tipo                    |
|----------------|-------------------------|
| id             | AutoField (PK)          |
| email          | EmailField (unique)     |
| first_name     | CharField               |
| last_name      | CharField               |
| password       | CharField (hashed)      |
| role           | CharField (choices)     |
| phone          | CharField               |
| employee_code  | CharField (unique)      |
| area           | FK → Area (nullable)    |
| is_active      | BooleanField            |
| created_at     | DateTimeField           |

### `Incident`
| Campo                  | Tipo                          |
|------------------------|-------------------------------|
| id                     | AutoField (PK)                |
| title                  | CharField(200)                |
| description            | TextField                     |
| status                 | CharField (choices)           |
| priority               | CharField (choices)           |
| area                   | FK → Area (PROTECT)           |
| machine                | FK → Machine (nullable)       |
| type                   | FK → IncidentType (PROTECT)   |
| reported_by            | FK → CustomUser (PROTECT)     |
| assigned_to            | FK → CustomUser (nullable)    |
| root_cause             | TextField                     |
| solution               | TextField                     |
| resolved_at            | DateTimeField (nullable)      |
| resolution_time_minutes| property (calculado)          |
| created_at             | DateTimeField                 |
| updated_at             | DateTimeField                 |

### `File`
| Campo       | Tipo                         |
|-------------|------------------------------|
| id          | AutoField (PK)               |
| incident    | FK → Incident (CASCADE)      |
| uploaded_by | FK → CustomUser (PROTECT)    |
| file        | FileField                    |
| file_type   | CharField (image|video)      |
| mime_type   | CharField                    |
| size_bytes  | PositiveIntegerField         |
| uploaded_at | DateTimeField                |

---

## Notas Adicionales

- **Incidencias:** No existen endpoints `PUT` o `DELETE`. La actualización parcial se hace vía `PATCH` solo para cambio de estado (`change-status`). No hay endpoint para editar `title`, `description`, `area`, `machine`, `type` o `priority` después de creada la incidencia.
- **Archivos:** No existen endpoints `PUT`, `PATCH` o `DELETE` para archivos.
- **Usuarios:** No existe `DELETE` (los usuarios se desactivan vía `is_active=False`). El `PATCH` general permite editar perfil. El `update-role` es un action dedicado solo para ADMIN.
- Los serializers `IncidentAssignSerializer` e `IncidentResolveSerializer` están definidos pero **no conectados** a ninguna vista aún.
- El `logs` app tiene servicios de logueo pero **no están integrados** con las vistas actuales.
- **JWT:** Access token expira en 8 horas, Refresh token en 7 días. Los refresh tokens se rotan y blacklistean.
- **CORS:** Permitido para `http://localhost:5173` y `http://127.0.0.1:5173`.
