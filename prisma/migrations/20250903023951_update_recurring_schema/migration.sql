/*
  Warnings:

  - Changed the type of `interval` on the `RecurringExpense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Interval" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "public"."RecurringExpense" DROP COLUMN "interval",
ADD COLUMN     "interval" "public"."Interval" NOT NULL;
