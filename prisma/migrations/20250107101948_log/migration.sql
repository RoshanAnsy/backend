/*
  Warnings:

  - You are about to drop the `UserLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLog" DROP CONSTRAINT "UserLog_userId_fkey";

-- DropTable
DROP TABLE "UserLog";

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" "ActionTypes" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
