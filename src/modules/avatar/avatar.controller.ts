import { Request, Response } from 'express';
import * as avatarService from "./avatar.service";

export const getAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const avatar = await avatarService.getAvatarByUser(userId);

    if (!avatar) return res.status(404).json({ error: "Avatar not found" });

    return res.json({ data: avatar });
  } catch (err) {
    console.error("Error fetching avatar:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { hatId, shirtId, pantsId, shoesId, userId } = req.body;

    const updated = await avatarService.updateAvatar(userId, {
      hatId,
      shirtId,
      pantsId,
      shoesId
    });

    return res.json({ message: "Avatar updated", data: updated });
  } catch (err) {
    console.error("Error updating avatar:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const initAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const avatar = await avatarService.createAvatar(userId);
    return res.status(201).json({ message: "Avatar created", data: avatar });
  } catch (err) {
    console.error("Error creating avatar:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
