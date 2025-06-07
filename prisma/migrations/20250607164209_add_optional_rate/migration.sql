-- AlterTable
ALTER TABLE "Coffee" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "rate" INTEGER DEFAULT 0;

-- CreateTable
CREATE TABLE "Tasting" (
    "id" TEXT NOT NULL,
    "aroma" INTEGER DEFAULT 0,
    "flavor" INTEGER DEFAULT 0,
    "body" INTEGER DEFAULT 0,
    "acidity" INTEGER DEFAULT 0,
    "balance" INTEGER DEFAULT 0,
    "aftertaste" INTEGER DEFAULT 0,
    "overallScore" DOUBLE PRECISION DEFAULT 0,
    "notes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coffeeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Tasting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tasting_coffeeId_userId_createdAt_key" ON "Tasting"("coffeeId", "userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Tasting" ADD CONSTRAINT "Tasting_coffeeId_fkey" FOREIGN KEY ("coffeeId") REFERENCES "Coffee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tasting" ADD CONSTRAINT "Tasting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
