import * as avatarService from "../../src/modules/avatar/avatar.service";
import { prisma } from "../../src/config/prisma";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    avatar: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("Avatar Service", () => {

  describe("getAvatarByUser", () => {
    it("should return avatar if exists", async () => {
      const mockAvatar = { id: 1, userId: 10 };

      (prisma.avatar.findUnique as jest.Mock).mockResolvedValue(mockAvatar);

      const result = await avatarService.getAvatarByUser(10);

      expect(prisma.avatar.findUnique).toHaveBeenCalledWith({
        where: { userId: 10 },
      });
      expect(result).toEqual(mockAvatar);
    });
  });

  describe("updateAvatar", () => {
    it("should update avatar correctly", async () => {
      const mockUpdated = { id: 1, userId: 10, hatId: 3 };

      (prisma.avatar.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await avatarService.updateAvatar(10, { hatId: 3 });

      expect(prisma.avatar.update).toHaveBeenCalledWith({
        where: { userId: 10 },
        data: { hatId: 3 },
      });

      expect(result).toEqual(mockUpdated);
    });
  });

  describe("createAvatar", () => {
    it("should create avatar", async () => {
      const mockAvatar = { id: 1, userId: 10 };

      (prisma.avatar.create as jest.Mock).mockResolvedValue(mockAvatar);

      const result = await avatarService.createAvatar(10);

      expect(prisma.avatar.create).toHaveBeenCalledWith({
        data: { userId: 10 },
      });

      expect(result).toEqual(mockAvatar);
    });
  });

});
