-- CreateTable
CREATE TABLE "Playlist" (
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
CREATE TABLE "Music" (
    "id" BIGINT NOT NULL,
    "title" TEXT,

    CONSTRAINT "music_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200),
    "password" VARCHAR(200),
    "created" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "googlesub" VARCHAR(300),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" BIGSERIAL NOT NULL,
    "origin_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_extension" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,

    CONSTRAINT "image_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPlaylist" (
    "user_id" BIGINT NOT NULL,
    "playlist_id" BIGINT NOT NULL,

    CONSTRAINT "UserPlaylist_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "image_file_name_uindex" ON "Image"("file_name");

-- AddForeignKey
ALTER TABLE "UserPlaylist" ADD CONSTRAINT "UserPlaylist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPlaylist" ADD CONSTRAINT "UserPlaylist_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
