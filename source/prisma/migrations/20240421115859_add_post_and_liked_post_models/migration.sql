/*
  Warnings:

  - Made the column `createdById` on table `Chat` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_createdById_fkey";

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "deleted" TIMESTAMP(3),
ALTER COLUMN "createdById" SET NOT NULL;

-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "deleted" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deleted" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "deleted" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "pictures" TEXT[],
    "watched" INTEGER,
    "createdById" TEXT NOT NULL,
    "likedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikedPost" (
    "likedById" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "LikedPost_likedById_postId_key" ON "LikedPost"("likedById", "postId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_likedById_fkey" FOREIGN KEY ("likedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikedPost" ADD CONSTRAINT "LikedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
