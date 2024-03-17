prisma/schema.prisma 파일에 Playlist 모델을 정의:

model Playlist {
  id          Int     @id @default(autoincrement())
  title       String
  description String?
}


npx prisma generate
