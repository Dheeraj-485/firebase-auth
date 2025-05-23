-- CreateEnum
CREATE TYPE "milkType" AS ENUM ('Cow', 'Buffalo');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Others');

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "alternate_phone" VARCHAR(12),
    "gender" "Gender" NOT NULL,
    "is_eggetarian" BOOLEAN NOT NULL,
    "milk_preference" "milkType" NOT NULL,
    "family_member_count" INTEGER NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "door_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "Profile"("user_id");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
