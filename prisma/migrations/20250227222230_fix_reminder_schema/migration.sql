/*
  Warnings:

  - You are about to drop the column `jobApplicationId` on the `Reminder` table. All the data in the column will be lost.
  - Added the required column `applicationId` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reminder` table without a default value. This is not possible if the table is not empty.
  - Made the column `message` on table `Reminder` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_jobApplicationId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_userId_fkey";

-- AlterTable
ALTER TABLE "Reminder" DROP COLUMN "jobApplicationId",
ADD COLUMN     "applicationId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "message" SET NOT NULL,
ALTER COLUMN "message" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
