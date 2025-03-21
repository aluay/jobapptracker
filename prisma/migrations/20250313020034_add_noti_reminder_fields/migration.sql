/*
  Warnings:

  - You are about to drop the column `message` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `title` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "message",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "message",
ADD COLUMN     "URL" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priority" INTEGER,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
