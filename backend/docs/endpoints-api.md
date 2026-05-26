# Documentación de Endpoints — Backend API

**Base URL:** `/api/v1`

**Autenticación:** JWT (Bearer token) vía `Authorization: Bearer <access_token>`.  
**Formato de respuesta errores:** `{ "success": false, "status_code": <int>, "message": "<str>", "errors": {...} }`

---

## Índice

1. [Autenticación (`/api/v1/auth/`)](#1-autenticación)
2. [Usuarios (`/api/v1/users/`)](#2-usuarios)
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
    "created_at": "datetime",
    "updated_at": "datetime"
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
  "created_at": "datetime",
  "updated_at": "datetime"
  }
}
```

---

## 2. Usuarios

Todas las rutas de usuarios requieren autenticación.  
**Nota:** Las rutas de usuarios están montadas en `/api/v1/users/`, no bajo `/api/v1/auth/`.  
Los usuarios no se eliminan físicamente (no hay `DELETE`); se desactivan vía `is_active=False`.

---

### 2.1 `GET /api/v1/users/`

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
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

---

### 2.2 `POST /api/v1/users/`

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

### 2.3 `GET /api/v1/users/{id}/`

Obtiene el detalle de un usuario específico.

- **Permiso:** `IsAuthenticated` + `IsAdminOrSupervisorOrManager`
- **Parámetros de ruta:** `id` (int) — ID del usuario
- **Headers:** `Authorization: Bearer <access_token>`
- **Respuesta 200:** Objeto de usuario (`UserProfileSerializer`)

---

### 2.4 `PATCH /api/v1/users/{id}/`

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

### 2.5 `PATCH /api/v1/users/{id}/update-role/`

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

Lista las incidencias asignadas al usuario autenticado. El `list` del ViewSet filtra por `assigned_to = request.user`, por lo que cada usuario ve solo sus incidencias asignadas.

- **Permiso:** `IsAuthenticated`
- **Query params opcionales:**

| Parámetro  | Ejemplo                 | Descripción                   |
| ---------- | ----------------------- | ----------------------------- |
| `page`     | `?page=2`               | Número de página              |
| `page_size`| `?page_size=25`         | Resultados por página         |
| `status`   | `?status=OPEN`          | Filtra por estado             |
| `priority` | `?priority=HIGH`        | Filtra por prioridad          |
| `area`     | `?area=1`               | Filtra por área               |
| `machine`  | `?machine=3`            | Filtra por máquina            |
| `type`     | `?type=2`               | Filtra por tipo de incidencia |
| `ordering` | `?ordering=-created_at` | Ordena resultados             |

- **Ejemplos:**

```http
GET /api/v1/incidents/?status=IN_PROGRESS
GET /api/v1/incidents/?priority=CRITICAL&ordering=-created_at
```

- **Respuesta 200:**

```json
{
  "success": true,
  "count": 1,
  "total_pages": 1,
  "current_page": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 15,
      "title": "Falla en cinta transportadora",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "created_at": "2026-05-25T10:30:00-03:00",
      "updated_at": "2026-05-25T10:30:00-03:00",
      "resolved_at": null
    }
  ]
}
```

- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `401 UNAUTHORIZED` | Usuario no autenticado |

---

### 3.2 `POST /api/v1/incidents/`

Crea una nueva incidencia. Asignaciones automáticas:

```
reported_by = request.user
status = OPEN
created_at = fecha y hora actual
```

Además registra un log mediante `log_incident_created`.

- **Permiso:** `IsAuthenticated` + `IsOperator` (solo OPERATOR puede crear)
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Body (JSON):**

```json
{
  "title": "Falla en cinta transportadora",
  "description": "La cinta se detuvo durante el proceso de producción.",
  "area": 1,
  "machine": 3,
  "type": 2,
  "priority": "HIGH"
}
```

- **Campos:**

| Campo         |        Tipo | Obligatorio | Descripción                                    |
| ------------- | ----------: | ----------: | ---------------------------------------------- |
| `title`       |      string |          Sí | Título breve de la incidencia (máx. 200)       |
| `description` |      string |          Sí | Descripción del problema detectado             |
| `area`        |      number |          Sí | ID del área donde ocurrió                      |
| `machine`     | number/null |          No | ID de la máquina relacionada                   |
| `type`        |      number |          Sí | ID del tipo de incidencia                      |
| `priority`    |      string |          No | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` (default: `MEDIUM`) |

- **Respuesta 201:**

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "description": "La cinta se detuvo durante el proceso de producción.",
  "status": "OPEN",
  "priority": "HIGH",
  "area": {
    "id": 1,
    "name": "Producción",
    "description": "Área de producción principal"
  },
  "machine": {
    "id": 3,
    "name": "Cinta transportadora 2",
    "machine_code": "M-002",
    "area": 1
  },
  "type": {
    "id": 2,
    "name": "Falla de máquina",
    "description": "Problemas técnicos en equipos"
  },
  "reported_by": {
    "id": 7,
    "full_name": "Juan Pérez",
    "role": "OPERATOR"
  },
  "assigned_to": null,
  "root_cause": "",
  "solution": "",
  "created_at": "2026-05-25T10:30:00-03:00",
  "updated_at": "2026-05-25T10:30:00-03:00",
  "resolved_at": null,
  "resolution_time_minutes": null
}
```

- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `400 BAD REQUEST` | Faltan campos obligatorios o algún ID no existe |
| `401 UNAUTHORIZED` | Usuario no autenticado |
| `403 FORBIDDEN` | Usuario autenticado pero no tiene rol `OPERATOR` |

---

### 3.3 `GET /api/v1/incidents/{id}/`

Obtiene el detalle completo de una incidencia específica.

- **Permiso:** `IsAuthenticated`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Ejemplo:** `GET /api/v1/incidents/15/`
- **Respuesta 200:**

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "description": "La cinta se detuvo durante el proceso de producción.",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "area": {
    "id": 1,
    "name": "Producción",
    "description": "Área de producción principal"
  },
  "machine": {
    "id": 3,
    "name": "Cinta transportadora 2",
    "machine_code": "M-002",
    "area": 1
  },
  "type": {
    "id": 2,
    "name": "Falla de máquina",
    "description": "Problemas técnicos en equipos"
  },
  "reported_by": {
    "id": 7,
    "full_name": "Juan Pérez",
    "role": "OPERATOR"
  },
  "assigned_to": {
    "id": 12,
    "full_name": "Carlos Gómez",
    "role": "OPERATOR"
  },
  "root_cause": "",
  "solution": "",
  "created_at": "2026-05-25T10:30:00-03:00",
  "updated_at": "2026-05-25T10:30:00-03:00",
  "resolved_at": null,
  "resolution_time_minutes": null
}
```

- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `401 UNAUTHORIZED` | Usuario no autenticado |
| `404 NOT FOUND` | No existe una incidencia con ese ID |

---

### 3.4 `PATCH /api/v1/incidents/{id}/assign/`

Asigna o reasigna un responsable a una incidencia. Si la incidencia está `OPEN`, pasa automáticamente a `IN_PROGRESS`. Registra `log_incident_assigned` o `log_incident_reassigned` según corresponda.

- **Permiso:** `IsAuthenticated` + `IsSupervisor`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Condiciones:**

| Regla | Descripción |
| ----- | ----------- |
| No se puede reasignar una incidencia cerrada | Si `status = CLOSED`, se rechaza la operación |
| El usuario destino debe ser válido | `assigned_to` debe existir |
| El usuario destino debe tener rol permitido | `OPERATOR` o `SUPERVISOR` |
| Si estaba `OPEN` | Cambia automáticamente a `IN_PROGRESS` |

- **Body (JSON):**

```json
{
  "assigned_to": 12
}
```

- **Campos:**

| Campo | Tipo | Obligatorio | Descripción |
| ----- | ---: | ----------: | ----------- |
| `assigned_to` | number | Sí | ID del usuario asignado |

- **Respuesta 200:**

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assigned_to": {
    "id": 12,
    "full_name": "Carlos Gómez",
    "role": "OPERATOR"
  },
  "resolved_at": null
}
```

- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `400 BAD REQUEST` | Usuario asignado inválido o incidencia cerrada |
| `401 UNAUTHORIZED` | Usuario no autenticado |
| `403 FORBIDDEN` | Usuario no tiene rol `SUPERVISOR` |
| `404 NOT FOUND` | No existe la incidencia |

---

### 3.5 `PATCH /api/v1/incidents/{id}/update-info/`

Amplía o modifica información básica de una incidencia. Campos permitidos: `priority`, `description`, `area`. Registra `log_incident_updated`.

- **Permiso:** `IsAuthenticated` + `IsSupervisor`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Condiciones:**

| Regla | Descripción |
| ----- | ----------- |
| Debe enviarse al menos un campo | No se acepta body vacío |
| Solo se actualizan campos permitidos | `priority`, `description`, `area` |
| `area` debe existir | Debe enviarse un ID válido de área |
| `priority` debe ser válida | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |

- **Body (JSON):** Puede enviar uno o varios campos:

```json
{ "priority": "CRITICAL" }
```

```json
{ "description": "La falla se repitió dos veces durante el turno mañana.", "area": 2 }
```

```json
{ "priority": "HIGH", "description": "Se amplía información luego de inspección inicial.", "area": 1 }
```

- **Campos:**

| Campo | Tipo | Obligatorio | Descripción |
| ----- | ---: | ----------: | ----------- |
| `priority` | string | No | Nueva prioridad |
| `description` | string | No | Nueva descripción o ampliación |
| `area` | number | No | Nueva área asociada |

- **Respuesta 200:**

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "description": "Se amplía información luego de inspección inicial.",
  "status": "IN_PROGRESS",
  "priority": "CRITICAL",
  "area": {
    "id": 1,
    "name": "Producción"
  }
}
```

- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `400 BAD REQUEST` | Body vacío, prioridad inválida o área inexistente |
| `401 UNAUTHORIZED` | Usuario no autenticado |
| `403 FORBIDDEN` | Usuario no tiene rol `SUPERVISOR` |
| `404 NOT FOUND` | No existe la incidencia |

---

### 3.6 `PATCH /api/v1/incidents/{id}/close/`

Cierra formalmente una incidencia. Al cerrar:

```
root_cause = <provisto>
solution = <provisto>
status = CLOSED
resolved_at = now()
```

Se calcula automáticamente `resolution_time_minutes` y se registra `log_incident_closed`.

- **Permiso:** `IsAuthenticated` + `IsSupervisor`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Condiciones:**

| Regla | Descripción |
| ----- | ----------- |
| `root_cause` es obligatorio | Debe indicarse la causa raíz |
| `solution` es obligatorio | Debe indicarse la solución aplicada |
| No se puede cerrar si la transición no es válida | Se usa `validate_status_transition(CLOSED)` |
| Si ya está cerrada | No permite nuevas transiciones |

- **Body (JSON):**

```json
{
  "root_cause": "Sensor de posición defectuoso por desgaste.",
  "solution": "Se reemplazó el sensor y se ajustó el plan de mantenimiento preventivo."
}
```

- **Campos:**

| Campo | Tipo | Obligatorio | Descripción |
| ----- | ---: | ----------: | ----------- |
| `root_cause` | string | Sí | Causa raíz identificada |
| `solution` | string | Sí | Solución aplicada |

- **Respuesta 200:**

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "status": "CLOSED",
  "root_cause": "Sensor de posición defectuoso por desgaste.",
  "solution": "Se reemplazó el sensor y se ajustó el plan de mantenimiento preventivo.",
  "resolved_at": "2026-05-25T15:45:00-03:00",
  "updated_at": "2026-05-25T15:45:00-03:00",
  "resolution_time_minutes": 315
}
```

- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `400 BAD REQUEST` | Faltan `root_cause` o `solution`, o transición inválida |
| `401 UNAUTHORIZED` | Usuario no autenticado |
| `403 FORBIDDEN` | Usuario no tiene rol `SUPERVISOR` |
| `404 NOT FOUND` | No existe la incidencia |

---

### 3.7 `PATCH /api/v1/incidents/{id}/change-status/`

Cambia el estado operativo de una incidencia. Solo el usuario asignado puede cambiar el estado. Registra `log_status_change`.

- **Permiso:** `IsAuthenticated` + `IsAssignedToIncident`
- **Headers:** `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Parámetros de ruta:** `id` (int) — ID de la incidencia
- **Estados contemplados:**

| Estado | Significado |
| ------ | ----------- |
| `OPEN` | Abierta |
| `IN_PROGRESS` | En progreso |
| `CLOSED` | Cerrada |

- **Transiciones válidas:**

| Estado actual | Puede pasar a |
| ------------- | ------------- |
| `OPEN` | `IN_PROGRESS`, `CLOSED` |
| `IN_PROGRESS` | `OPEN`, `CLOSED` |
| `CLOSED` | Ninguno |

- **Body (JSON):**

```json
{ "status": "IN_PROGRESS" }
```

```json
{ "status": "OPEN" }
```

```json
{ "status": "CLOSED" }
```

- **Campos:**

| Campo | Tipo | Obligatorio | Descripción |
| ----- | ---: | ----------: | ----------- |
| `status` | string | Sí | Nuevo estado de la incidencia |

- **Respuesta 200:**

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assigned_to": {
    "id": 12,
    "full_name": "Carlos Gómez",
    "role": "OPERATOR"
  }
}
```

- **Nota:** Si se cambia a `CLOSED`, se asigna automáticamente `resolved_at`. Si se cambia a otro estado, `resolved_at` se limpia.
- **Errores:**

| Código | Motivo |
| -----: | ------ |
| `400 BAD REQUEST` | Transición inválida o estado no permitido |
| `401 UNAUTHORIZED` | Usuario no autenticado |
| `403 FORBIDDEN` | Usuario no asignado a la incidencia |
| `404 NOT FOUND` | No existe la incidencia |

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
| updated_at     | DateTimeField           |

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

- **Incidencias:** No existen endpoints `PUT` o `DELETE`. Las operaciones de modificación se realizan vía `PATCH` en los siguientes actions: `assign/` (reasignar responsable), `update-info/` (editar priority, description, area), `change-status/` (cambiar estado) y `close/` (cerrar con root_cause y solution).
- **Archivos:** No existen endpoints `PUT`, `PATCH` o `DELETE` para archivos.
- **Usuarios:** No existe `DELETE` (los usuarios se desactivan vía `is_active=False`). El `PATCH` general permite editar perfil. El `update-role` es un action dedicado solo para ADMIN.
- El serializer `IncidentResolveSerializer` está definido pero **no conectado** a ninguna vista aún.
- El `logs` app tiene servicios de logueo que están **integrados** con las vistas actuales (creación, asignación, actualización, cambio de estado, cierre).
- **JWT:** Access token expira en 8 horas, Refresh token en 7 días. Los refresh tokens se rotan y blacklistean.
- **CORS:** Permitido para `http://localhost:5173` y `http://127.0.0.1:5173`.
