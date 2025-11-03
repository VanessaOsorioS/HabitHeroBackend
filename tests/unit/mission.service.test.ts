import { jest } from "@jest/globals";

jest.unstable_mockModule("../../src/config/prisma.ts", () => ({
  prisma: {
    mission: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

const { prisma } = await import("../../src/config/prisma.ts");
const missionService = await import("../../src/modules/mission/mission.service.ts");

describe('Mission Service', () => {
  describe('getAllMissions', () => {
    it('should return all missions', async () => {
      const mockMissions = [
        { id: 1, name: 'Mission 1' },
        { id: 2, name: 'Mission 2' },
      ];
      (prisma.mission.findMany as jest.Mock).mockResolvedValue(mockMissions);

      const missions = await missionService.getAllMissions();

      expect(prisma.mission.findMany).toHaveBeenCalledTimes(1);
      expect(Array.isArray(missions)).toBe(true);
      expect(missions).toHaveLength(2);
      expect(missions).toEqual(mockMissions);
    });
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      const mockMissionData = { name: 'New Mission', description: 'Test mission' };
      const mockCreatedMission = { id: 1, ...mockMissionData };

      (prisma.mission.create as jest.Mock).mockResolvedValue(mockCreatedMission);

      const createdMission = await missionService.createMission(mockMissionData);

      // Verifica que Prisma fue llamado con los datos correctos
      expect(prisma.mission.create).toHaveBeenCalledTimes(1);
      expect(prisma.mission.create).toHaveBeenCalledWith({ data: mockMissionData });

      // Verifica que el resultado es el esperado
      expect(createdMission).toEqual(mockCreatedMission);
    });

    it('should throw an error if Prisma create fails', async () => {
      const mockMissionData = { name: 'Fail Mission' };
      (prisma.mission.create as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(missionService.createMission(mockMissionData))
        .rejects
        .toThrow('Database error');
    });
  });
});
