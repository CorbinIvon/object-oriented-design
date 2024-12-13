-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_objectId_fkey";

-- CreateIndex
CREATE INDEX "History_objectId_idx" ON "History"("objectId");

-- CreateIndex
CREATE INDEX "History_userId_idx" ON "History"("userId");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
