-- CreateTable
CREATE TABLE "Flow" (
    "id" SERIAL NOT NULL,
    "when" JSONB NOT NULL,
    "steps" JSONB NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FlowToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FlowToUser_AB_unique" ON "_FlowToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FlowToUser_B_index" ON "_FlowToUser"("B");

-- AddForeignKey
ALTER TABLE "_FlowToUser" ADD CONSTRAINT "_FlowToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FlowToUser" ADD CONSTRAINT "_FlowToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
