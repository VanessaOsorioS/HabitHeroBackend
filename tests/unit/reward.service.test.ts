import { calculateRewards } from "../../src/modules/reward/reward.service.ts";

describe("calculateRewards", () => {
  it("debería calcular recompensas correctamente cuando se cumple a tiempo", () => {
    const mission = {
      dificultad: 4,
      prioridad: 3,
      tiempoEstimado: 60,
      tiempoReal: 55,
      completadaATiempo: true,
      cantidadAplazamientos: 0,
    };

    const result = calculateRewards(mission);

    expect(result.xp).toBeGreaterThan(0);
    expect(result.coins).toBe(Math.floor(result.xp / 5));
    expect(result.detalleFactores.bonusTiempo).toBe(0.2);
  });

  it("debería aplicar penalizaciones si se aplaza y se pasa de tiempo", () => {
    const mission = {
      dificultad: 2,
      prioridad: 2,
      tiempoEstimado: 30,
      tiempoReal: 80,
      completadaATiempo: false,
      cantidadAplazamientos: 2,
    };

    const result = calculateRewards(mission);

    expect(result.xp).toBeGreaterThan(0);
    expect(result.factorTotal).toBeLessThan(0);
  });
});
