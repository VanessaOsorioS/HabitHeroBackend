import { Mission, MissionStatusHistory } from "../../../generated/prisma";
import { MISSION_CONSTANTS } from "./mission.constants";

/** Calcula XP y COIN finales */
export function calculateRewards(mission: Mission, statusHistory: MissionStatusHistory[],
    postponements: number = 0, realMinutes: number = 0) {
    const { W_DIFF,
        W_PRIO,
        BONUS_ON_TIME,
        PENALTY_LATE,
        PENALTY_PER_POSTPONE,
        FACTOR_MIN, FACTOR_MAX,
        COIN_DIVISOR } = MISSION_CONSTANTS;

    const baseXP = W_DIFF * mission.difficulty + W_PRIO * mission.priority;
    let factor = 0;

    // Tiempo
    if (mission.dueDate) {
        factor += Date.now() <= mission.dueDate.getTime() ? BONUS_ON_TIME : PENALTY_LATE;
    }

    // Aplazamientos
    factor += postponements * PENALTY_PER_POSTPONE;

    // Velocidad
    factor += speedFactor(mission.durationMinutes, realMinutes);

    const factorTotal = applyFactorLimits(factor, FACTOR_MIN, FACTOR_MAX);
    const xp = Math.max(1, Math.round(baseXP * (1 + factorTotal)));
    const coin = Math.floor(xp / COIN_DIVISOR);

    return { xp, coin };
}

/** Factor de velocidad según duración real/estimada */
function speedFactor(estimated?: number | null, real?: number | null): number {
    if (!estimated || !real) return 0;
    const ratio = real / estimated;
    if (ratio <= 0.5) return +0.20;
    if (ratio <= 1.0) return +0.10;
    if (ratio <= 1.5) return 0;
    if (ratio <= 2.0) return -0.10;
    return -0.20;
}

function applyFactorLimits(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}