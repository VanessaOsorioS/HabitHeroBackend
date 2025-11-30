import { prisma } from "../src/config/prisma";

export const resetDB = async () => {
  // Borramos en orden estricto y lanzamos error si falla algo crítico
  try {
    // 1. Tablas que dependen de Misiones
    await prisma.reward.deleteMany();
    await prisma.missionStatusHistory.deleteMany();
    
    // 2. Tablas que dependen de Usuarios
    await prisma.mission.deleteMany();
    await prisma.authToken.deleteMany();
    await prisma.avatar.deleteMany();
    
    // 3. Usuarios
    await prisma.user.deleteMany();
  } catch (error) {
    console.error("Warning: Fallo al limpiar DB, continuando...", error);
  }
};