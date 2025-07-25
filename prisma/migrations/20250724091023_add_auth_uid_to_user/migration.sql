/*
  Warnings:

  - A unique constraint covering the columns `[auth_uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "auth_uid" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "User_auth_uid_key" ON "User"("auth_uid");
