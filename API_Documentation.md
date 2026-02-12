# API Documentation - ItsYourTime

Base URL: `/api`

## Authentication

All endpoints (except Login and Registration) require a Bearer Token.

### Headers
```http
Authorization: Bearer <YOUR_TOKEN>
Content-Type: application/json
```

---

## 1. Authentication (`/api/auth`)

### Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "cedula": "123456789",
  "password": "secret_password"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhGciOiJIUzI1NiIsInR5..."
}
```

---

## 2. Users (`/api/Usuarios`)

### Get All Users (Admin Only)
**GET** `/api/Usuarios`

**Response:**
```json
[
  {
    "id": "guid...",
    "nombre": "Juan",
    "apellido": "Perez",
    "cedula": "123456",
    "sucursalId": "guid...",
    "sucursal": { "nombre": "Sucursal Central", ... },
    "isAdmin": false,
    "isActive": true
  }
]
```

### Get Users by Sucursal (Admin Only)
**GET** `/api/Usuarios/BySucursal/{sucursalId}`

**Response:** Array of users belonging to the specified branch.

### Get Single User
**GET** `/api/Usuarios/{id}`
- **Security**: Current User or Admin.

### Register User (Public)
**POST** `/api/Usuarios` 
*(Note: Automatically sets `isAdmin: false`)*

**Request Body:**
```json
{
  "nombre": "Ana",
  "apellido": "Lopez",
  "cedula": "987654",
  "password": "password123",
  "sucursalId": "guid..."
}
```

### Update User
**PUT** `/api/Usuarios/{id}`
- **Security**: Current User (can edit own profile) or Admin.

### Delete User (Admin Only)
**DELETE** `/api/Usuarios/{id}`

---

## 3. Hours (`/api/Horas`)

### Get Hours
**GET** `/api/Horas`
**Query Params (Optional):**
- `isAprobada` (true/false)
- `usuarioId` (GUID) - *Admin only filter*
- `fechaDesde` (ISO Date) - Filter from date
- `fechaHasta` (ISO Date) - Filter to date

**Behavior:**
- **Admin**: Can see all hours. Can filter by `usuarioId`.
- **User**: Can ONLY see their own hours (server ignores `usuarioId` param and forces current user).

**Response:**
```json
[
  {
    "id": "guid...",
    "usuarioId": "guid...",
    "horasExtra": 2.5,
    "fechaIngreso": "2023-10-27",
    "submittedAt": "2023-10-27T10:00:00Z",
    "isAprobada": false,
    "aprobadaPor": null,
    "aprobadaEn": null,
    "comentarios": "Overtime for project X",
    "isDeleted": false,
    "usuario": { 
      "id": "guid...",
      "nombre": "Juan", 
      "apellido": "Perez",
      "sucursal": { "nombre": "Central" }
    },
    "aprobadaPorNavigation": null,
    "horasAprobaciones": []
  }
]
```

### Get Single Hour
**GET** `/api/Horas/{id}`
- **Security**: Current User (own records) or Admin.

### Submit Hours
**POST** `/api/Horas`

**Request Body:**
```json
{
  "horasExtra": 2.0,
  "fechaIngreso": "2023-10-28", // DateOnly format YYYY-MM-DD
  "comentarios": "Extra verification work"
}
```
*(Note: `usuarioId` is automatically set to the logged-in user)*

### Update/Delete Hours
**PUT** `/api/Horas/{id}`
**DELETE** `/api/Horas/{id}`
- **Security**: Current User (own records) or Admin.

### Approve/Reject Hours (Admin Only)
**POST** `/api/Horas/{id}/aprobar`

**Request Body:**
```json
{
  "aprobar": true,
  "comentario": "Aprobado: Horas verificadas correctamente"
}
```

**Response:**
```json
{
  "message": "Hora aprobada exitosamente",
  "hora": { /* Hora object */ }
}
```

### Get Available Hours Summary
**GET** `/api/Horas/disponibles`
- **Security**: Current User only

**Response:**
```json
{
  "horasAprobadas": 10.5,
  "horasPendientes": 5.0,
  "horasRechazadas": 2.0,
  "totalHoras": 15.5
}
```

### Get Hours by Branch (Admin Only)
**GET** `/api/Horas/por-sucursal`
**Query Params (Optional):**
- `sucursalId` (GUID)
- `isAprobada` (true/false)
- `fechaDesde` (ISO Date)
- `fechaHasta` (ISO Date)

**Response:**
```json
[
  {
    "sucursalId": "guid...",
    "sucursalNombre": "Central",
    "horas": [
      {
        "id": "guid...",
        "usuarioId": "guid...",
        "usuarioNombre": "Juan",
        "usuarioApellido": "Perez",
        "usuarioCedula": "123456",
        "horasExtra": 2.5,
        "fechaIngreso": "2023-10-27",
        "submittedAt": "2023-10-27T10:00:00Z",
        "isAprobada": false,
        "aprobadaPor": null,
        "aprobadorNombre": null,
        "aprobadaEn": null,
        "comentarios": "Overtime work"
      }
    ],
    "totalRegistros": 10,
    "totalHorasExtra": 25.5
  }
]
```

### Get Hours by Date Range
**GET** `/api/Horas/por-fecha`
**Query Params (Optional):**
- `fechaDesde` (ISO Date)
- `fechaHasta` (ISO Date)

**Behavior:**
- **Admin**: Can see all hours in date range
- **User**: Can only see own hours in date range

---

## 4. Branches (`/api/Sucursals`)

### Get All Branches
**GET** `/api/Sucursals`

**Response:**
```json
[
  {
    "id": "guid...",
    "nombre": "Central",
    "ubicacion": "San Jose"
  }
]
```

### Manage Branches (Admin Only)
- **POST** `/api/Sucursals`
- **PUT** `/api/Sucursals/{id}`
- **DELETE** `/api/Sucursals/{id}`

---

## 5. Approval History (`/api/HorasAprobaciones`)

### Get Approval History
**GET** `/api/HorasAprobaciones`
**Query Params (Optional):**
- `horasId` (GUID) - Filter by hour ID

**Behavior:**
- **Admin**: Can see all approval records
- **User**: Can only see approvals for their own hours

**Response:**
```json
[
  {
    "id": "guid...",
    "horasId": "guid...",
    "aprobadorId": "guid...",
    "accion": "Aprobado",
    "comentario": "Looks good",
    "fecha": "2023-10-27T12:00:00Z",
    "aprobador": {
      "id": "guid...",
      "nombre": "Admin",
      "apellido": "User"
    },
    "horas": {
      "id": "guid...",
      "usuarioId": "guid...",
      "usuario": { "nombre": "Juan", "apellido": "Perez" }
    }
  }
]
```

### Get Single Approval Record
**GET** `/api/HorasAprobaciones/{id}`
- **Security**: Current User (own hours) or Admin

### Create/Update/Delete Approval Record (Admin Only)
- **POST** `/api/HorasAprobaciones`
- **PUT** `/api/HorasAprobaciones/{id}`
- **DELETE** `/api/HorasAprobaciones/{id}`
*(Note: These endpoints are primarily for internal use. Use `/api/Horas/{id}/aprobar` for normal approval workflow)*

---

## TypeScript Interfaces (Frontend Models)

```typescript
export interface Sucursal {
  id: string;
  nombre: string;
  ubicacion?: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  sucursalId?: string;
  sucursal?: Sucursal;
  isAdmin: boolean;
  isActive: boolean;
  // Password is usually not returned or needed in the frontend model for display
}

export interface Hora {
  id: string;
  usuarioId: string;
  usuario?: Usuario;
  horasExtra: number;
  fechaIngreso: string; // "YYYY-MM-DD"
  submittedAt: string;
  isAprobada: boolean;
  aprobadaPor?: string;
  aprobadaEn?: string;
  comentarios?: string;
  horasAprobaciones?: HorasAprobacion[];
}

export interface HorasAprobacion {
  id: string;
  horasId: string;
  aprobadorId: string;
  accion: string;
  comentario?: string;
  fecha: string;
}

export interface LoginResponse {
  token: string;
}
```
