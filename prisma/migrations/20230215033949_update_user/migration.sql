/*
  Warnings:

  - Made the column `provider` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `firstName` VARCHAR(255) NULL,
    MODIFY `lastName` VARCHAR(255) NULL,
    MODIFY `provider` ENUM('FACEBOOK', 'GOOGLE', 'EMAIL') NOT NULL DEFAULT 'EMAIL';
