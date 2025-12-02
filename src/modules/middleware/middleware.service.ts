import { prisma } from "../../config/prisma";

export const findToken = async (token: string) => {
    const storedToken = await prisma.authToken.findUnique({
        where: { tokenString: token },
    });
    return storedToken;
};

export const findUserById = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    return user;
}
