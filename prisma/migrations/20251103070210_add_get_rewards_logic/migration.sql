/*
  Warnings:

  - You are about to drop the column `status` on the `Mission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MissionState" AS ENUM ('COMPLETED', 'PENDING', 'FAILED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Reward" ALTER COLUMN "description" DROP NOT NULL;

-- DropEnum
DROP TYPE "public"."MissionStatus";

-- CreateTable
CREATE TABLE "MissionStatusHistory" (
    "id" SERIAL NOT NULL,
    "missionId" INTEGER NOT NULL,
    "status" "MissionState" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MissionStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MissionStatusHistory" ADD CONSTRAINT "MissionStatusHistory_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
