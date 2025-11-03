import { prisma } from "../../config/prisma.js";

/**
 * Interfaz con los datos necesarios para calcular las recompensas.
 */
export interface MissionPerformance {
  dificultad: number;
  prioridad: number;
  tiempoEstimado: number;
  tiempoReal: number;
  completadaATiempo: boolean;
  cantidadAplazamientos: number;
}

/**
 * Resultado del cálculo de recompensas.
 */
export interface RewardCalculation {
  xp: number;
  coins: number;
  baseXp: number;
  factorTotal: number;
  detalleFactores: {
    bonusTiempo: number;
    penalizacionRetraso: number;
    penalizacionAplazamientos: number;
    factorVelocidad: number;
  };
}

/**
 * Calcula las recompensas (XP y monedas) según las reglas del documento.
 */
export const calculateRewards = (mission: MissionPerformance): RewardCalculation => {
  const W_DIFF = 10;
  const W_PRIO = 5;
  const baseXp = W_DIFF * mission.dificultad + W_PRIO * mission.prioridad;
  const bonusTiempo = mission.completadaATiempo ? 0.20 : 0;
  const penalizacionRetraso = mission.completadaATiempo ? 0 : -0.30;
  const penalizacionAplazamientos = -0.10 * (mission.cantidadAplazamientos || 0);

  const ratio = mission.tiempoReal / mission.tiempoEstimado;
  const velocidadRangos: [number, number][] = [
    [0.5, 0.20],
    [1.0, 0.10],
    [1.5, 0.0],
    [2.0, -0.10],
  ];
  const factorVelocidad =
    velocidadRangos.find(([limite]) => ratio <= limite)?.[1] ?? -0.20;

  const factorTotal = Math.min(
    0.5,
    Math.max(-0.8, bonusTiempo + penalizacionRetraso + penalizacionAplazamientos + factorVelocidad)
  );
  const xp = Math.round(baseXp * (1 + factorTotal));
  const coins = Math.floor(xp / 5);

  return {
    xp,
    coins,
    baseXp,
    factorTotal,
    detalleFactores: {
      bonusTiempo,
      penalizacionRetraso,
      penalizacionAplazamientos,
      factorVelocidad,
    },
  };
};

/**
 * Obtiene todas las recompensas.
 */
export const getAllRewards = async () => {
  return await prisma.reward.findMany();
};

/**
 * Crea las recompensas calculadas (XP y COIN) para una misión.
 */
export const createRewardForMission = async (missionId: number, data: RewardCalculation) => {
  return await prisma.reward.createMany({
    data: [
      {
        missionId,
        rewardType: "XP",
        value: data.xp,
        description: `Experiencia obtenida (Base ${data.baseXp}, Factor ${data.factorTotal.toFixed(2)})`,
      },
      {
        missionId,
        rewardType: "COIN",
        value: data.coins,
        description: "Monedas obtenidas",
      },
    ],
  });
};
