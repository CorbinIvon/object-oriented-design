/*
  Warnings:

  - A unique constraint covering the columns `[creatorId,name,version]` on the table `ObjectDef` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ObjectDef" ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0';

-- CreateIndex
CREATE UNIQUE INDEX "ObjectDef_creatorId_name_version_key" ON "ObjectDef"("creatorId", "name", "version");
