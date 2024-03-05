/*
  Warnings:

  - A unique constraint covering the columns `[foreignUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_foreignUserId_key" ON "User"("foreignUserId");
