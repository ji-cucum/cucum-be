/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Music` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Playlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserPlaylist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPlaylist" DROP CONSTRAINT "UserPlaylist_playlist_id_fkey";

-- DropForeignKey
ALTER TABLE "UserPlaylist" DROP CONSTRAINT "UserPlaylist_user_id_fkey";

-- DropTable
DROP TABLE "Image";

-- DropTable
DROP TABLE "Music";

-- DropTable
DROP TABLE "Playlist";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserPlaylist";

-- CreateTable
CREATE TABLE "playlist" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "creator" TEXT NOT NULL DEFAULT 'cucum',
    "description" TEXT,
    "scope" TEXT NOT NULL DEFAULT 'public',
    "thumbnail" TEXT,

    CONSTRAINT "playlist_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music" (
    "id" BIGINT NOT NULL,
    "title" TEXT,

    CONSTRAINT "music_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200),
    "password" VARCHAR(200),
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "googlesub" VARCHAR(300),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" BIGSERIAL NOT NULL,
    "origin_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_extension" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "image_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_playlist" (
    "user_id" BIGINT NOT NULL,
    "playlist_id" BIGINT NOT NULL,

    CONSTRAINT "user_playlist_pkey" PRIMARY KEY ("user_id","playlist_id")
);

-- CreateTable
CREATE TABLE "playlist_music" (
    "playlist_id" BIGINT NOT NULL,
    "music_id" BIGINT NOT NULL,

    CONSTRAINT "playlist_music_pkey" PRIMARY KEY ("playlist_id","music_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "image_file_name_uindex" ON "image"("file_name");

-- AddForeignKey
ALTER TABLE "user_playlist" ADD CONSTRAINT "user_playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_playlist" ADD CONSTRAINT "user_playlist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_music" ADD CONSTRAINT "playlist_music_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playlist_music" ADD CONSTRAINT "playlist_music_music_id_fkey" FOREIGN KEY ("music_id") REFERENCES "music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
