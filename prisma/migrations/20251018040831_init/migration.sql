-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('STUDY', 'TASK');

-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "MissionType" NOT NULL,
    "dueDate" TIMESTAMP(3),
    "durationMinutes" INTEGER,
    "category" TEXT,
    "priority" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "daily" BOOLEAN NOT NULL,
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);
