-- CreateTable
CREATE TABLE "Preorder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "products" INTEGER NOT NULL,
    "preorderWhen" TEXT NOT NULL,
    "startsAt" DATETIME NOT NULL,
    "endsAt" DATETIME,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Preorder_createdAt_idx" ON "Preorder"("createdAt");

-- CreateIndex
CREATE INDEX "Preorder_startsAt_idx" ON "Preorder"("startsAt");

-- CreateIndex
CREATE INDEX "Preorder_status_idx" ON "Preorder"("status");
