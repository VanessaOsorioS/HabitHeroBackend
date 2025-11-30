import { Request, Response } from "express";
import * as avatarService from "../../src/modules/avatar/avatar.service";
import { getAvatar, updateAvatar, initAvatar } from "../../src/modules/avatar/avatar.controller";

jest.mock("../../src/modules/avatar/avatar.service");

const mockReq = (body: any) => ({ body } as Request);
const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Avatar Controller", () => {

  describe("getAvatar", () => {
    it("should return 404 if avatar not found", async () => {
      (avatarService.getAvatarByUser as jest.Mock).mockResolvedValue(null);

      const req = mockReq({ userId: 5 });
      const res = mockRes();

      await getAvatar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Avatar not found" });
    });
  });

  describe("updateAvatar", () => {
    it("should update avatar", async () => {
      (avatarService.updateAvatar as jest.Mock).mockResolvedValue({ hatId: 1 });

      const req = mockReq({ userId: 1, hatId: 1 });
      const res = mockRes();

      await updateAvatar(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("initAvatar", () => {
    it("should create avatar", async () => {
      (avatarService.createAvatar as jest.Mock).mockResolvedValue({
        id: 1,
        userId: 1,
      });

      const req = mockReq({ userId: 1 });
      const res = mockRes();

      await initAvatar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

});
