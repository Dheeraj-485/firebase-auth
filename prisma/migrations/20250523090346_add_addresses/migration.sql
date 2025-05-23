/*
  Warnings:

  - You are about to drop the column `State` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `address_line` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `state` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "State",
DROP COLUMN "address_line",
ADD COLUMN     "address_line2" VARCHAR(100),
ADD COLUMN     "state" VARCHAR(30) NOT NULL;
