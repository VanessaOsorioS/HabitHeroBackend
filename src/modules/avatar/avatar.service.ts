import { prisma } from "../../config/prisma";

export const getAvatarByUser = async (userId: number) => {
  return await prisma.avatar.findUnique({
    where: { userId },
  });
};

export const updateAvatar = async (userId: number, data: any) => {
  return await prisma.avatar.update({
    where: { userId },
    data
  });
};

export const createAvatar = async (userId: number) => {
  return await prisma.avatar.create({
    data: { userId }
  });
};