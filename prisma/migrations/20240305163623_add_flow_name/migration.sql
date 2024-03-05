/*
  Warnings:

  - Added the required column `name` to the `Flow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flow" ADD COLUMN     "name" TEXT NOT NULL;
