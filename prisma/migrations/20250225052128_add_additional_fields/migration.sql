/*
  Warnings:

  - Made the column `location` on table `JobApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "followUpDate" TIMESTAMP(3),
ADD COLUMN     "interviewDate" TIMESTAMP(3),
ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "recruiterEmail" TEXT,
ADD COLUMN     "recruiterName" TEXT,
ADD COLUMN     "recruiterPhone" TEXT,
ADD COLUMN     "salary" TEXT,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "appliedDate" DROP DEFAULT;
