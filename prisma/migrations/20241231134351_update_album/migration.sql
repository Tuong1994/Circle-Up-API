/*
  Warnings:

  - You are about to drop the column `userId` on the `album` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `album` DROP FOREIGN KEY `Album_userId_fkey`;

-- AlterTable
ALTER TABLE `album` DROP COLUMN `userId`,
    ADD COLUMN `authorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Album` ADD CONSTRAINT `Album_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
