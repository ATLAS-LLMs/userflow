/*
  Warnings:

  - You are about to drop the column `finished` on the `Flow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "finished",
ADD COLUMN     "currStepId" INTEGER NOT NULL DEFAULT 0;
