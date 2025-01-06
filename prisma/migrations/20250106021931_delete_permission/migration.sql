/*
  Warnings:

  - You are about to drop the `permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `permission` DROP FOREIGN KEY `Permission_userId_fkey`;

-- DropTable
DROP TABLE `permission`;
