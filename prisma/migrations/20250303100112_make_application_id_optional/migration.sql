-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_applicationId_fkey";

-- AlterTable
ALTER TABLE "Reminder" ALTER COLUMN "applicationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
