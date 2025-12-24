# Chat App

Ứng dụng nhắn tin thời gian thực (Real-time Chat Application).

## 🛠 Công nghệ sử dụng

- **Client:** React (Vite), TypeScript, Shadcn UI, Socket.IO Client.
- **Server:** Node.js, Express, Prisma, MongoDB (Replica Set), Redis, Socket.IO.

## 🚀 Hướng dẫn cài đặt

### 1. Khởi chạy các Service (Docker)

Dự án yêu cầu các service nền tảng như MongoDB (Replica Set) và Redis.
Vui lòng xem hướng dẫn chi tiết cách khởi chạy tại tài liệu sau:

👉 **[Hướng dẫn khởi chạy Docker và cấu hình Replica Set](docs/init-docker.md)**

### 2. Chạy ứng dụng

Sau khi các service Docker đã hoạt động, bạn có thể khởi chạy Client và Server.

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

#### Chế độ production

Ở client hay server, bạn có thể build và chạy ở chế độ production, tốc độ ứng dụng sẽ nhanh hơn rất nhiều.
Chạy bash sau ở cả hai folder client và server

```bash
npm run build
npm run start
```
