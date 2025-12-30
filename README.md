# Chat App

Ứng dụng nhắn tin thời gian thực (Real-time Chat Application).

## 🛠 Công nghệ sử dụng

- **Client:** React (Vite), TypeScript, Shadcn UI, Socket.IO Client.
- **Server:** Node.js, Express, Prisma, MongoDB (Replica Set), Redis, Socket.IO.

## 🚀 Hướng dẫn cài đặt (Ưu tiên dùng Docker)

Đây là cách nhanh nhất để chạy toàn bộ dự án (Full Stack) bao gồm: Client, Server, Database, Redis chỉ với 1 lệnh.

### 1. Chạy với Docker Compose

Dành cho môi trường Local, chạy lệnh sau:

```bash
docker-compose -f docker-compose.local-full.yml up --build -d
```

Sau khi chạy xong:

- **Client:** http://localhost:3000
- **Server:** http://localhost:8000
- **Database:** mongodb://localhost:27021 (Replica Set: rs0)
- **Redis:** localhost:6379

> **✅ Tự động khởi tạo:** MongoDB Replica Set sẽ được script tự động khởi tạo khi container khởi động lần đầu. Bạn không cần chạy lệnh thủ công.

---

## 🛠 Hướng dẫn chạy thủ công (Dành cho Dev muốn debug từng phần)

Nếu bạn muốn chạy riêng lẻ từng phần để Develop (Dev), bạn làm theo các bước sau:

### 1. Khởi chạy các Service nền (Database & Redis)

Chúng ta sử dụng Docker để chạy các service nền tảng (MongoDB, Redis) tách biệt với code.

```bash
# Chỉ chạy DB và Redis
docker-compose -f docker-compose.dev.yml up -d
```

_Xem chi tiết tại: [Hướng dẫn khởi chạy Docker và cấu hình Replica Set](docs/init-docker.md)_

### 2. Chạy Source Code

#### Server (Backend)

1. Cấu hình biến môi trường trong `.env`, tham khảo file `.env.example`.
2. Chạy các lệnh sau:

```bash
cd server
npm install
npx prisma db push  # Đồng bộ schema với database
npm run dev
```

#### Client (Frontend)

1. Cấu hình biến môi trường trong `.env`, tham khảo file `.env.example`.
2. Chạy các lệnh sau:

```bash
cd client
npm install
npm run dev
```

### 3. Chế độ production

Ở client hay server, bạn có thể build và chạy ở chế độ production, tốc độ ứng dụng sẽ nhanh hơn rất nhiều.
Chạy bash sau ở cả hai folder client và server

```bash
npm run build
npm run start
```
