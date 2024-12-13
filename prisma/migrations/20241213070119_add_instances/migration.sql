/*
  Warnings:

  - You are about to drop the `Object` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_objectId_fkey";

-- DropForeignKey
ALTER TABLE "DiagramElement" DROP CONSTRAINT "DiagramElement_objectId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_objectId_fkey";

-- DropForeignKey
ALTER TABLE "Object" DROP CONSTRAINT "Object_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectAttribute" DROP CONSTRAINT "ObjectAttribute_objectId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectMethod" DROP CONSTRAINT "ObjectMethod_objectId_fkey";

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_fromObjectId_fkey";

-- DropForeignKey
ALTER TABLE "Relationship" DROP CONSTRAINT "Relationship_toObjectId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnObjects" DROP CONSTRAINT "TagsOnObjects_objectId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "instanceId" TEXT;

-- DropTable
DROP TABLE "Object";

-- CreateTable
CREATE TABLE "ObjectDef" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categories" TEXT[],

    CONSTRAINT "ObjectDef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instance" (
    "id" TEXT NOT NULL,
    "objectDefId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstanceAttribute" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "InstanceAttribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ObjectDef" ADD CONSTRAINT "ObjectDef_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instance" ADD CONSTRAINT "Instance_objectDefId_fkey" FOREIGN KEY ("objectDefId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instance" ADD CONSTRAINT "Instance_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstanceAttribute" ADD CONSTRAINT "InstanceAttribute_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_fromObjectId_fkey" FOREIGN KEY ("fromObjectId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_toObjectId_fkey" FOREIGN KEY ("toObjectId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectAttribute" ADD CONSTRAINT "ObjectAttribute_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectMethod" ADD CONSTRAINT "ObjectMethod_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnObjects" ADD CONSTRAINT "TagsOnObjects_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagramElement" ADD CONSTRAINT "DiagramElement_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "ObjectDef"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;
