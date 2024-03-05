/*
  Warnings:

  - You are about to drop the column `currStepId` on the `Flow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "currStepId",
ADD COLUMN     "currStepNumber" INTEGER NOT NULL DEFAULT 0;
