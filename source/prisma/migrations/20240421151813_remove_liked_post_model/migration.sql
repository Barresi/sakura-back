/*
  Warnings:

  - You are about to drop the `LikedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LikedPost" DROP CONSTRAINT "LikedPost_likedById_fkey";

-- DropForeignKey
ALTER TABLE "LikedPost" DROP CONSTRAINT "LikedPost_postId_fkey";

-- DropTable
DROP TABLE "LikedPost";

-- CreateTable
CREATE TABLE "_Liked" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Liked_AB_unique" ON "_Liked"("A", "B");

-- CreateIndex
CREATE INDEX "_Liked_B_index" ON "_Liked"("B");

-- AddForeignKey
ALTER TABLE "_Liked" ADD CONSTRAINT "_Liked_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Liked" ADD CONSTRAINT "_Liked_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
