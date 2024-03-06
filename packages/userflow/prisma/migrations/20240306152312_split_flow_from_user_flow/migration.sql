/*
  Warnings:

  - You are about to drop the column `name` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `steps` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the column `when` on the `Flow` table. All the data in the column will be lost.
  - You are about to drop the `_FlowToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `flowDefinitionId` to the `Flow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Flow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FlowToUser" DROP CONSTRAINT "_FlowToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_FlowToUser" DROP CONSTRAINT "_FlowToUser_B_fkey";

-- AlterTable
ALTER TABLE "Flow" DROP COLUMN "name",
DROP COLUMN "steps",
DROP COLUMN "when",
ADD COLUMN     "flowDefinitionId" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_FlowToUser";

-- CreateTable
CREATE TABLE "FlowDefinition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "when" JSONB NOT NULL,
    "steps" JSONB NOT NULL,

    CONSTRAINT "FlowDefinition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_flowDefinitionId_fkey" FOREIGN KEY ("flowDefinitionId") REFERENCES "FlowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
