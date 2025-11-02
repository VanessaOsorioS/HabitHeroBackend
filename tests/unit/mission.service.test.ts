import * as missionService from '../../src/modules/mission/mission.service';
import { prisma } from '../../src/config/prisma';

jest.mock('../../src/config/prisma', () => ({
  prisma: {
    mission: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
  },
}));

describe('Mission Service - getMissions' , () => {
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