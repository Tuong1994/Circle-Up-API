/*
  Warnings:

  - Added the required column `audience` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `album` ADD COLUMN `audience` INTEGER NOT NULL,
    ADD COLUMN `cityCode` INTEGER NULL,
    ADD COLUMN `description` VARCHAR(3000) NULL,
    ADD COLUMN `feeling` INTEGER NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `AlbumOnUser` (
    `id` VARCHAR(191) NOT NULL,
    `isDelete` BOOLEAN NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `albumId` VARCHAR(191) NOT NULL,

    INDEX `AlbumOnUser_isDelete_idx`(`isDelete`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AlbumOnUser` ADD CONSTRAINT `AlbumOnUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AlbumOnUser` ADD CONSTRAINT `AlbumOnUser_albumId_fkey` FOREIGN KEY (`albumId`) REFERENCES `Album`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
