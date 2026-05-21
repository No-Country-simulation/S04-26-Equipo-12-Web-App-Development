# Documentación de Endpoints — Backend API

**Base URL:** `/api/v1`

**Autenticación:** JWT (Bearer token) vía `Authorization: Bearer <access_token>`.  
**Formato de respuesta errores:** `{ "success": false, "status_code": <int>, "message": "<str>", "errors": {...} }`

---

## Índice

1. [Autenticación (`/api/v1/auth/`)](#1-autenticación)
2. [Incidencias (`/api/v1/incidents/`)](#2-incidencias)
3. [Archivos (`/api/v1/incidents/{id}/files/`)](#3-archivos)

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
    "role": "string (OPERATOR|SUPERVISOR|MANAGER)",
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

### 1.2 `POST /api/v1/auth/register/`

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
  "role": "string (OPERATOR|SUPERVISOR|MANAGER)",
  "phone": "string",
  "employee_code": "string",
  "area": "int | null",
  "area_name": "string | null",
  "is_active": "boolean",
  "created_at": "datetime"
}
```

---

## 2. Incidencias

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

### 2.1 `GET /api/v1/incidents/`

Lista las incidencias asignadas al usuario autenticado.

- **Permiso:** `IsAuthenticated`
- **Query params opcionales:** `page`, `page_size`, `status`, `priority`, `area`, `machine`, `type`, `ordering`
- **Respuesta:** Paginada con objetos de incidencia detallados

---

### 2.2 `POST /api/v1/incidents/`

Crea una nueva incidencia. `reported_by` se asigna automáticamente al usuario autenticado.

- **Permiso:** `IsAuthenticated`
- **Headers:** `Content-Type: application/json`
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

### 2.3 `GET /api/v1/incidents/{id}/`

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

## 3. Archivos

Rutas anidadas dentro de una incidencia. Todas requieren autenticación.

---

### 3.1 `GET /api/v1/incidents/{incident_pk}/files/`

Lista todos los archivos adjuntos a una incidencia.

- **Permiso:** `IsAuthenticated`
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

### 3.2 `POST /api/v1/incidents/{incident_pk}/files/`

Sube un archivo (imagen o video) a una incidencia.

- **Permiso:** `IsAuthenticated`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: multipart/form-data`
- **Parámetros de ruta:** `incident_pk` (int) — ID de la incidencia
- **Body (form-data):**

| Campo  | Tipo | Obligatorio | Descripción         |
|--------|------|-------------|---------------------|
| `file` | File | Sí          | Archivo a subir     |

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

## 4. Django Admin

- **URL:** `/admin/`
- **Autenticación:** Django admin (separada del JWT)
- **Modelos registrados:** Area, IncidentType, Machine, Incident, IncidentAssignment, Resolution, IncidentLog

---

## 5. Modelos de Datos (Referencia Rápida)

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

- No existen endpoints `PUT`, `PATCH` o `DELETE` para incidencias ni archivos.
- Los serializers `IncidentAssignSerializer` e `IncidentResolveSerializer` están definidos pero **no conectados** a ninguna vista aún.
- El `logs` app tiene servicios de logueo pero **no están integrados** con las vistas actuales.
- **JWT:** Access token expira en 8 horas, Refresh token en 7 días. Los refresh tokens se rotan y blacklistean.
- **CORS:** Permitido para `http://localhost:5173` y `http://127.0.0.1:5173`.
