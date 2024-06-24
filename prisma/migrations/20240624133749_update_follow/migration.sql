/*
  Warnings:

  - You are about to drop the column `postImagesId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `postVideosId` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `user` table. All the data in the column will be lost.
  - Added the required column `postId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `Media_postImagesId_fkey`;

-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `Media_postVideosId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_eventId_fkey`;

-- AlterTable
ALTER TABLE `follow` ADD COLUMN `postId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `media` DROP COLUMN `postImagesId`,
    DROP COLUMN `postVideosId`,
    ADD COLUMN `postId` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `eventId`;

-- CreateTable
CREATE TABLE `EventOnUser` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventOnUser` ADD CONSTRAINT `EventOnUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventOnUser` ADD CONSTRAINT `EventOnUser_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
