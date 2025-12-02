-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('COMPLETED', 'PENDING');

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "status" "MissionStatus" NOT NULL DEFAULT 'PENDING';
