# HabitHero Backend

Este proyecto implementa un backend modular en **Node.js** usando **Express** como framework HTTP y **Prisma ORM** para la comunicación con una base de datos **PostgreSQL**.  
El objetivo es mantener una arquitectura escalable y mantenible, organizada por módulos y capas: **controladores**, **servicios**, **rutas** y **configuración**.

## Tecnologías Principales

- **Node.js** ≥ 18.18
- **Express** – Framework web minimalista
- **Prisma ORM** – ORM moderno para TypeScript y Node.js
- **TypeScript** – Tipado estático y soporte para desarrollo escalable
- **PostgreSQL** – Base de datos relacional

## Requisitos Previos

Antes de instalar, asegúrate de tener instalado:
- **Node.js** v18.18 o superior
- **npm** (incluido con Node.js)
- **PostgreSQL** en ejecución y accesible
- Una base de datos creada (por ejemplo `missions_db`)
    

## Instalación del Proyecto

```bash
# Clonar el repositorio
git clone https://github.com/tu_usuario/tu_repo.git
cd tu_repo

# Instalar dependencias
npm install
```

### Configurar variables de entorno

Crea el archivo `.env` en la carpeta raíz del proyecto.

Luego edítalo con tus credenciales de base de datos locales:

```bash
DATABASE_URL="postgresql://usuario:password@localhost:5432/missions_db"
PORT=3000
```

## Configuración de Prisma

Prisma ya está inicializado en este proyecto.
Los modelos se definen dentro del archivo principal de esquema:
`/prisma/schema.prisma`

### Ejemplo: Definición del modelo `Mission`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Mission {
  id                  Int           @id @default(autoincrement())
  titulo              String
  descripcion         String?
  tipo                TipoMision
  fechaVencimiento    DateTime?
  duracionMinutos     Int?
  categoria           String?
  prioridad           Int
  dificultad          Int
  diaria              Boolean
  recordatorioActivado Boolean      @default(false)
  fechaCreacion       DateTime      @default(now())
}

enum TipoMision {
  DIARIA
  ESTUDIO
  PLAZO
}
``` 

### Aplicar cambios al esquema

Cuando realices modificaciones en el archivo `schema.prisma`, ejecuta el siguiente comando para actualizar la base de datos:

`npx prisma migrate dev --name update_models`

Este comando:
- Actualiza la base de datos según los modelos definidos.
- Regenera automáticamente el cliente de Prisma.

Una vez regenerado, puedes importar el cliente en cualquier servicio desde:

```ts
import { prisma } from "../../config/prisma";
```

Opcionalmente, puedes visualizar la base de datos con Prisma Studio:

`npx prisma studio`

## Estructura de Carpetas

```bash
habit-hero-backend/
├── prisma/
│   └── schema.prisma              # Definición de modelos y relaciones
├── src/
│   ├── config/
│   │   └── prisma.ts              # Cliente Prisma
│   ├── modules/
│   │   └── mission/
│   │       ├── mission.model.ts       # Tipos o interfaces (si aplica)
│   │       ├── mission.service.ts     # Lógica de negocio y Prisma
│   │       ├── mission.controller.ts  # Controlador HTTP
│   │       ├── mission.routes.ts      # Rutas Express para misiones
│   ├── routes/
│   │   └── index.ts               # Reúne todas las rutas del sistema
│   ├── app.ts                     # Configuración de Express
│   └── server.ts                  # Punto de entrada del servidor
├── package.json
├── tsconfig.json
├── .env
└── README.md

```

## Flujo de Ejemplo: Registrar una Misión

### 1. Cliente → API

El cliente (por ejemplo, React o React Native con Expo) envía una solicitud:

```bash
POST /api/missions
Content-Type: application/json

{
  "title": "Estudiar para examen de redes",
  "type": "DAILY",
  "rewardPoints": 150
}
```

### 2. Flujo Interno

```bash
Cliente (React/Expo)
 → POST /api/missions
 → mission.routes.ts
 → mission.controller.ts
 → mission.service.ts
 → Prisma ORM
 → PostgreSQL

```

## Ejemplo de Implementación de Archivos

### **config/prisma.ts**

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

### **mission.service.ts**

```ts
import { prisma } from "../../config/prisma";

export const createMission = async (data: any) => {
  return await prisma.mission.create({ data });
};

```

### **mission.controller.ts**

```ts
import { Request, Response } from "express";
import * as missionService from "./mission.service";

export const createMission = async (req: Request, res: Response) => {
  try {
    const mission = await missionService.createMission(req.body);
    res.status(201).json(mission);
  } catch (error) {
    res.status(500).json({ message: "Error creating mission", error });
  }
};

```

### **mission.routes.ts**

```ts
import { Router } from "express";
import { createMission } from "./mission.controller";

const router = Router();

router.post("/", createMission);

export default router;
```

### **routes/index.ts**

```ts
import { Router } from "express";
import missionRoutes from "../modules/mission/mission.routes";

const router = Router();

router.use("/missions", missionRoutes);

export default router;

```

### **app.ts**

```ts
import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use("/api", routes);

export default app;

```

### **server.ts**

```ts
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

```

## Comandos Principales

```bash
# Ejecutar el servidor en modo desarrollo
npm run dev

# Compilar TypeScript
npm run build

# Ejecutar la versión compilada
npm start

# Aplicar migraciones de Prisma
npx prisma migrate dev

# Ver el panel visual de la base de datos
npx prisma studio

```

## Flujo de Desarrollo Sugerido

1. Define el modelo en `prisma/schema.prisma`.
2. Ejecuta `npx prisma migrate dev` para reflejar los cambios en la base de datos.
3. Implementa la lógica en:
    - `module.service.ts` → comunicación con Prisma y reglas de negocio.
    - `module.controller.ts` → maneja las solicitudes HTTP.
    - `module.routes.ts` → define los endpoints del módulo.
4. Agrega el módulo a `routes/index.ts`.
5. Verifica la respuesta en el cliente (por ejemplo, una app React Native con Expo).