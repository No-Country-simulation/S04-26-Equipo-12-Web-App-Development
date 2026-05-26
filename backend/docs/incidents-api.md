## 1. Crear incidencia

```http
POST /api/v1/incidents/
```

### Descripción

Permite que un operador reporte una nueva incidencia desde el sistema.

Al crear la incidencia, el sistema asigna automáticamente:

```txt
reported_by = request.user
status = OPEN
created_at = fecha y hora actual
```

También se registra un log de creación mediante `log_incident_created`.

### Permisos

```txt
Usuario autenticado con rol OPERATOR
```

### Body esperado

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

### Campos

| Campo         |        Tipo | Obligatorio | Descripción                                    |
| ------------- | ----------: | ----------: | ---------------------------------------------- |
| `title`       |      string |          Sí | Título breve de la incidencia                  |
| `description` |      string |          Sí | Descripción del problema detectado             |
| `area`        |      number |          Sí | ID del área donde ocurrió                      |
| `machine`     | number/null |          No | ID de la máquina relacionada                   |
| `type`        |      number |          Sí | ID del tipo de incidencia                      |
| `priority`    |      string |          Sí | Prioridad: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |

### Respuesta exitosa

```http
201 CREATED
```

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
    "username": "operador1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "role": "OPERATOR"
  },
  "assigned_to": null,
  "root_cause": "",
  "solution": "",
  "created_at": "2026-05-25T10:30:00-03:00",
  "resolved_at": null,
  "resolution_time_minutes": null
}
```

### Errores posibles

|             Código | Motivo                                           |
| -----------------: | ------------------------------------------------ |
|  `400 BAD REQUEST` | Faltan campos obligatorios o algún ID no existe  |
| `401 UNAUTHORIZED` | Usuario no autenticado                           |
|    `403 FORBIDDEN` | Usuario autenticado pero no tiene rol `OPERATOR` |

---

# 2. Listar incidencias asignadas

```http
GET /api/v1/incidents/
```

### Descripción

Devuelve las incidencias asignadas al usuario autenticado.

Actualmente, el queryset filtra:

```python
assigned_to = request.user
```

Por eso, cada usuario ve solamente las incidencias que tiene asignadas.

### Permisos

```txt
Usuario autenticado
```

### Query params disponibles

| Parámetro  | Ejemplo                 | Descripción                   |
| ---------- | ----------------------- | ----------------------------- |
| `status`   | `?status=OPEN`          | Filtra por estado             |
| `priority` | `?priority=HIGH`        | Filtra por prioridad          |
| `area`     | `?area=1`               | Filtra por área               |
| `machine`  | `?machine=3`            | Filtra por máquina            |
| `type`     | `?type=2`               | Filtra por tipo de incidencia |
| `ordering` | `?ordering=-created_at` | Ordena resultados             |

### Ejemplos

```http
GET /api/v1/incidents/?status=IN_PROGRESS
```

```http
GET /api/v1/incidents/?priority=CRITICAL&ordering=-created_at
```

### Respuesta exitosa

```http
200 OK
```

```json
[
  {
    "id": 15,
    "title": "Falla en cinta transportadora",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "created_at": "2026-05-25T10:30:00-03:00",
    "resolved_at": null
  }
]
```

### Errores posibles

|             Código | Motivo                 |
| -----------------: | ---------------------- |
| `401 UNAUTHORIZED` | Usuario no autenticado |

---

# 3. Ver detalle de incidencia

```http
GET /api/v1/incidents/{id}/
```

### Descripción

Devuelve el detalle completo de una incidencia.

### Permisos

```txt
Usuario autenticado
```

### Path params

| Parámetro |   Tipo | Descripción         |
| --------- | -----: | ------------------- |
| `id`      | number | ID de la incidencia |

### Ejemplo

```http
GET /api/v1/incidents/15/
```

### Respuesta exitosa

```http
200 OK
```

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
    "username": "operador1",
    "role": "OPERATOR"
  },
  "assigned_to": {
    "id": 12,
    "username": "tecnico1",
    "role": "OPERATOR"
  },
  "root_cause": "",
  "solution": "",
  "created_at": "2026-05-25T10:30:00-03:00",
  "resolved_at": null,
  "resolution_time_minutes": null
}
```

### Errores posibles

|             Código | Motivo                              |
| -----------------: | ----------------------------------- |
| `401 UNAUTHORIZED` | Usuario no autenticado              |
|    `404 NOT FOUND` | No existe una incidencia con ese ID |

---

# 4. Asignar o reasignar responsable

```http
PATCH /api/v1/incidents/{id}/assign/
```

### Descripción

Permite que un supervisor asigne o reasigne un responsable a una incidencia.

Si la incidencia está en estado `OPEN`, automáticamente pasa a:

```txt
IN_PROGRESS
```

También genera un log:

```txt
log_incident_assigned
```

o:

```txt
log_incident_reassigned
```

según corresponda.

### Permisos

```txt
Usuario autenticado con rol SUPERVISOR
```

### Condiciones

| Regla                                        | Descripción                                    |
| -------------------------------------------- | ---------------------------------------------- |
| No se puede reasignar una incidencia cerrada | Si `status = CLOSED`, se rechaza la operación  |
| El usuario destino debe ser válido           | `assigned_to` debe existir                     |
| El usuario destino debe tener rol permitido  | Según tu serializer: `OPERATOR` o `SUPERVISOR` |
| Si estaba `OPEN`                             | Cambia automáticamente a `IN_PROGRESS`         |

### Body esperado

```json
{
  "assigned_to": 12
}
```

### Campos

| Campo         |   Tipo | Obligatorio | Descripción             |
| ------------- | -----: | ----------: | ----------------------- |
| `assigned_to` | number |          Sí | ID del usuario asignado |

### Respuesta exitosa

```http
200 OK
```

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assigned_to": {
    "id": 12,
    "username": "tecnico1",
    "role": "OPERATOR"
  },
  "resolved_at": null
}
```

### Errores posibles

|             Código | Motivo                                         |
| -----------------: | ---------------------------------------------- |
|  `400 BAD REQUEST` | Usuario asignado inválido o incidencia cerrada |
| `401 UNAUTHORIZED` | Usuario no autenticado                         |
|    `403 FORBIDDEN` | Usuario no tiene rol `SUPERVISOR`              |
|    `404 NOT FOUND` | No existe la incidencia                        |

---

# 5. Ampliar o modificar información

```http
PATCH /api/v1/incidents/{id}/update-info/
```

### Descripción

Permite que un supervisor modifique información básica de una incidencia.

Campos permitidos:

```txt
priority
description
area
```

También genera un log mediante:

```txt
log_incident_updated
```

### Permisos

```txt
Usuario autenticado con rol SUPERVISOR
```

### Condiciones

| Regla                                | Descripción                               |
| ------------------------------------ | ----------------------------------------- |
| Debe enviarse al menos un campo      | No se acepta body vacío                   |
| Solo se actualizan campos permitidos | `priority`, `description`, `area`         |
| `area` debe existir                  | Debe enviarse un ID válido de área        |
| `priority` debe ser válida           | Debe coincidir con las choices del modelo |

### Body esperado

Podés enviar uno o varios campos:

```json
{
  "priority": "CRITICAL"
}
```

```json
{
  "description": "La falla se repitió dos veces durante el turno mañana.",
  "area": 2
}
```

```json
{
  "priority": "HIGH",
  "description": "Se amplía información luego de inspección inicial.",
  "area": 1
}
```

### Campos

| Campo         |   Tipo | Obligatorio | Descripción                    |
| ------------- | -----: | ----------: | ------------------------------ |
| `priority`    | string |          No | Nueva prioridad                |
| `description` | string |          No | Nueva descripción o ampliación |
| `area`        | number |          No | Nueva área asociada            |

### Respuesta exitosa

```http
200 OK
```

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

### Errores posibles

|             Código | Motivo                                            |
| -----------------: | ------------------------------------------------- |
|  `400 BAD REQUEST` | Body vacío, prioridad inválida o área inexistente |
| `401 UNAUTHORIZED` | Usuario no autenticado                            |
|    `403 FORBIDDEN` | Usuario no tiene rol `SUPERVISOR`                 |
|    `404 NOT FOUND` | No existe la incidencia                           |

---

# 6. Cambiar estado

```http
PATCH /api/v1/incidents/{id}/change-status/
```

### Descripción

Permite cambiar el estado operativo de una incidencia.

También genera un log mediante:

```txt
log_status_change
```

### Permisos

```txt
Usuario autenticado y asignado a la incidencia
```

### Estados contemplados

| Estado        | Significado |
| ------------- | ----------- |
| `OPEN`        | Abierta     |
| `IN_PROGRESS` | En progreso |


### Transiciones válidas del modelo

| Estado actual | Puede pasar a           |
| ------------- | ----------------------- |
| `OPEN`        | `IN_PROGRESS`, `CLOSED` |
| `IN_PROGRESS` | `OPEN`, `CLOSED`        |
| `CLOSED`      | Ninguno                 |

### Body esperado

```json
{
  "status": "IN_PROGRESS"
}
```

o:

```json
{
  "status": "OPEN"
}
```

### Campos

| Campo    |   Tipo | Obligatorio | Descripción                   |
| -------- | -----: | ----------: | ----------------------------- |
| `status` | string |          Sí | Nuevo estado de la incidencia |

### Respuesta exitosa

```http
200 OK
```

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "assigned_to": {
    "id": 12,
    "username": "tecnico1"
  }
}
```

### Errores posibles

|             Código | Motivo                                    |
| -----------------: | ----------------------------------------- |
|  `400 BAD REQUEST` | Transición inválida o estado no permitido |
| `401 UNAUTHORIZED` | Usuario no autenticado                    |
|    `403 FORBIDDEN` | Usuario no asignado a la incidencia       |
|    `404 NOT FOUND` | No existe la incidencia                   |

---

# 7. Cerrar incidencia

```http
PATCH /api/v1/incidents/{id}/close/
```

### Descripción

Permite cerrar formalmente una incidencia.

Esta acción guarda:

```txt
root_cause
solution
status = CLOSED
resolved_at = now()
```

También genera un log mediante:

```txt
log_incident_closed
```

### Permisos

```txt
Usuario autenticado con rol SUPERVISOR
```

### Condiciones

| Regla                                            | Descripción                                 |
| ------------------------------------------------ | ------------------------------------------- |
| `root_cause` es obligatorio                      | Debe indicarse la causa raíz                |
| `solution` es obligatorio                        | Debe indicarse la solución aplicada         |
| No se puede cerrar si la transición no es válida | Se usa `validate_status_transition(CLOSED)` |
| Si ya está cerrada                               | No permite nuevas transiciones              |

### Body esperado

```json
{
  "root_cause": "Sensor de posición defectuoso por desgaste.",
  "solution": "Se reemplazó el sensor y se ajustó el plan de mantenimiento preventivo."
}
```

### Campos

| Campo        |   Tipo | Obligatorio | Descripción             |
| ------------ | -----: | ----------: | ----------------------- |
| `root_cause` | string |          Sí | Causa raíz identificada |
| `solution`   | string |          Sí | Solución aplicada       |

### Respuesta exitosa

```http
200 OK
```

```json
{
  "id": 15,
  "title": "Falla en cinta transportadora",
  "status": "CLOSED",
  "root_cause": "Sensor de posición defectuoso por desgaste.",
  "solution": "Se reemplazó el sensor y se ajustó el plan de mantenimiento preventivo.",
  "resolved_at": "2026-05-25T15:45:00-03:00",
  "resolution_time_minutes": 315
}
```

### Errores posibles

|             Código | Motivo                                                  |
| -----------------: | ------------------------------------------------------- |
|  `400 BAD REQUEST` | Faltan `root_cause` o `solution`, o transición inválida |
| `401 UNAUTHORIZED` | Usuario no autenticado                                  |
|    `403 FORBIDDEN` | Usuario no tiene rol `SUPERVISOR`                       |
|    `404 NOT FOUND` | No existe la incidencia                                 |
