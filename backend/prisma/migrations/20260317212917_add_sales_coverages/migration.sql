-- CreateTable
CREATE TABLE "sales_coverages" (
    "id" TEXT NOT NULL,
    "substituteId" TEXT NOT NULL,
    "coveredUserId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_coverages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sales_coverages_substituteId_idx" ON "sales_coverages"("substituteId");

-- CreateIndex
CREATE INDEX "sales_coverages_coveredUserId_idx" ON "sales_coverages"("coveredUserId");

-- AddForeignKey
ALTER TABLE "sales_coverages" ADD CONSTRAINT "sales_coverages_substituteId_fkey" FOREIGN KEY ("substituteId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_coverages" ADD CONSTRAINT "sales_coverages_coveredUserId_fkey" FOREIGN KEY ("coveredUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
