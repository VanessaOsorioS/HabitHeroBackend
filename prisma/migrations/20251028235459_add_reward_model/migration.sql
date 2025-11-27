-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('XP', 'COIN', 'BADGE', 'COLLECTABLE', 'TITLE');

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "rewardType" "RewardType" NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "missionId" INTEGER NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
