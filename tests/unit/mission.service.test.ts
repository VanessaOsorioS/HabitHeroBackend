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

describe('Mission Service', () => {
  describe('getAllMissions', () => {
    it('should return all missions for a user', async () => {
      const mockUserId = 1; 
      const mockMissions = [
        { id: 1, title: 'Mission 1', userId: mockUserId },
        { id: 2, title: 'Mission 2', userId: mockUserId },
      ];
      
      (prisma.mission.findMany as jest.Mock).mockResolvedValue(mockMissions);

      const missions = await missionService.getAllMissions(mockUserId);

      expect(prisma.mission.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: mockUserId }
      }));
      expect(missions).toEqual(mockMissions);
    });
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      const mockMissionData = { name: 'New Mission', description: 'Test mission' };
      const mockCreatedMission = { id: 1, ...mockMissionData };

      (prisma.mission.create as jest.Mock).mockResolvedValue(mockCreatedMission);

      const createdMission = await missionService.createMission(mockMissionData);

      expect(prisma.mission.create).toHaveBeenCalledTimes(1);
      expect(prisma.mission.create).toHaveBeenCalledWith({ data: mockMissionData });

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
