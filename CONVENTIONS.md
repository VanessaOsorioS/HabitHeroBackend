## **Convenciones de Imports y Exports en el Proyecto**

Este proyecto utiliza **TypeScript con módulos ECMAScript (ESM)** como formato de importación y exportación.  
Esto permite mantener un código moderno, compatible con el ecosistema actual de Node.js y más claro en su estructura modular.

### **1. Uso de módulos ESM**
En lugar de usar la sintaxis antigua de CommonJS (`require` / `module.exports`), todo el proyecto debe seguir el estándar **ESM**:

```ts
// Correcto (ESM)
import express from "express";
export default app;

// Incorrecto (CommonJS)
const express = require("express");
module.exports = app;

```

Esto permite aprovechar:
- Autocompletado y verificación de tipos con TypeScript.
- Compatibilidad con herramientas modernas (ESLint, Jest, etc.).
- Importaciones más limpias y consistentes.

### **2. Convención general de imports**
Para mantener una arquitectura **clara, consistente y escalable**, se siguen las siguientes reglas según el tipo de archivo y el contexto:

| Caso de uso                                       | Sintaxis recomendada                                 | Ejemplo                                                | Justificación                                                                                                                                                                               |
| ------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dependencias externas** (Express, Prisma, etc.) | `import módulo from "paquete";`                      | `import express from "express";`                       | Librerías con `export default`. Sintaxis estándar moderna.                                                                                                                                  |
| **Servicios de un módulo completo**               | `import * as moduleService from "./module.service";` | `import * as missionService from "./mission.service";` | Claridad y consistencia. Todos los métodos del servicio se agrupan bajo un mismo espacio de nombres (`missionService.create()`, `missionService.getAll()`, etc.). Ideal para controladores. |
| **Funciones o helpers específicos**               | `import { función } from "./utils";`                 | `import { formatDate } from "../../utils/date";`       | Útil cuando solo se usa una o pocas funciones. Hace explícito qué se está importando.                                                                                                       |
| **Clases, tipos o interfaces**                    | `import { Tipo } from "../types";`                   | `import { Mission } from "@prisma/client";`            | Mantiene la semántica del tipado de TypeScript y evita cargar código innecesario.                                                                                                           |

---

### **3. Convención para exports**

- **Para exportar múltiples funciones relacionadas**, usa **exports nombrados**:
```ts
// mission.service.ts
export const createMission = async () => { ... };
export const getAllMissions = async () => { ... };
    ```
    
- **Para exportar una clase o módulo principal**, usa **export default**:
```ts
// app.ts
const app = express();
export default app;
```
Esto mantiene la coherencia:
- Archivos con **varias utilidades → exports nombrados.**
- Archivos con **una entidad principal → export default.**

### **4. Ejemplo completo de imports y exports coherentes**
**mission.service.ts**

```ts
import { prisma } from "../../config/prisma";

export const createMission = async (data: any) => {
  return await prisma.mission.create({ data });
};

export const getAllMissions = async () => {
  return await prisma.mission.findMany();
};

```

**mission.controller.ts**

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

export const getAllMissions = async (req: Request, res: Response) => {
  try {
    const missions = await missionService.getAllMissions();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching missions", error });
  }
};

```

**mission.routes.ts**

```ts
import { Router } from "express";
import { createMission, getAllMissions } from "./mission.controller";

const router = Router();

router.post("/", createMission);
router.get("/", getAllMissions);

export default router;

```

**routes/index.ts**

```ts
import { Router } from "express";
import missionRoutes from "../modules/mission/mission.routes";

const router = Router();
router.use("/missions", missionRoutes);

export default router;

```

### **5. Beneficios de esta convención**
- Código **consistente y fácil de navegar**: todos los módulos siguen el mismo formato.
- **Estandarización** para equipos que trabajan en paralelo.
- **Escalabilidad**: al crecer el número de módulos, las importaciones siguen siendo claras (`userService`, `rewardService`, `missionService`, etc.).
- Facilita la **detección de errores** en SonarQube o ESLint al mantener un único patrón.