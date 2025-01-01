-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_savedId_fkey`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_savedId_fkey` FOREIGN KEY (`savedId`) REFERENCES `Saved`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
