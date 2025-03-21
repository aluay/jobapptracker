/*
  Warnings:

  - You are about to drop the column `notificationSent` on the `Reminder` table. All the data in the column will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "notificationSent";

-- DropTable
DROP TABLE "Notification";
