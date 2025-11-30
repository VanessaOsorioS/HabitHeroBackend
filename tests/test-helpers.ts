import { prisma } from "../src/config/prisma";

export const resetDB = async () => {
  // Intentamos borrar tabla por tabla.
  // Si alguna falla, lo ignoramos y seguimos.
  // Esto asegura que el `beforeAll` NO se detenga y siempre cree el usuario nuevo.

  try { await prisma.reward.deleteMany(); } catch (e) {}
  try { await prisma.missionStatusHistory.deleteMany(); } catch (e) {}
  
  // Borramos Mission antes que User
  try { await prisma.mission.deleteMany(); } catch (e) {}
  
  // Borramos Avatar y Token antes que User
  try { await prisma.avatar.deleteMany(); } catch (e) {}
  try { await prisma.authToken.deleteMany(); } catch (e) {}

  // Finalmente el User
  try { await prisma.user.deleteMany(); } catch (e) {}
};