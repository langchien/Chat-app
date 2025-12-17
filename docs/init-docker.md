# Cách để chạy ứng dụng với Docker và Docker Compose ở local

**Nếu dùng mongo atlas (cloud) thì bỏ qua bước cấu hình replica set**

## Yêu cầu

- Cài đặt Docker: [Hướng dẫn cài đặt Docker](https://docs.docker.com/get-docker/)
- Cài đặt Docker Compose: [Hướng dẫn cài đặt Docker Compose](https://docs.docker.com/compose/install/)

## Bước 1: Cấu hình môi trường

- Tạo file `.env` trong thư mục `/` dựa trên file mẫu `.env.example` và điều chỉnh các biến môi trường nếu cần thiết.

## Bước 2: Cấu hình file Hosts (để chạy mongodb replica set)

[Chi tiết về replica set xem tại đây](https://docs.mongodb.com/manual/replication/#replica-set-configuration-options)
[Hướng dẫn bởi Gemini](https://gemini.google.com/share/ec9ad31225c1)

- Mở file hosts trên máy tính của bạn: (mở bằng quyền quản trị)
  - Windows: `C:\Windows\System32\drivers\etc\hosts`
  - macOS/Linux: `/etc/hosts`
- Thêm dòng sau vào cuối file để ánh xạ tên miền cục bộ:
  ```
  127.0.0.1 mongo1 mongo2 mongo3
  ```

## Bước 3: Chạy Docker Compose

- Mở terminal và điều hướng đến thư mục gốc của dự án.
- Chạy lệnh sau để khởi động các dịch vụ Docker:

```bash
docker-compose up -d
```

# Bước 4: Setup MongoDB Replica Set

- Kết nối vào container MongoDB primary:

```bash
docker exec -it mongo1 mongosh --host mongo1 --port YOUR_PRIMARY_PORT
```

- Chạy lệnh sau trong shell MongoDB để khởi tạo replica set:

```javascript
// rs.initiate({_id: "rs0",members: [{ _id: 0, host: "mongo1:27021" },{ _id: 1, host: "mongo2:27022" },{ _id: 2, host: "mongo3:27023" }]})
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo1:27021" },
    { _id: 1, host: "mongo2:27022" },
    { _id: 2, host: "mongo3:27023" },
  ],
});
```

- Nếu response trả về `ok: 1`, replica set đã được khởi tạo thành công.

## Bước 5: Kiểm tra kết nối

- Kiểm tra kết nối từ ứng dụng đến MongoDB replica set để đảm bảo mọi thứ hoạt động bình thường.

# Bước 6: Khởi tạo ứng dụng (backend) và database

- Mở terminal và điều hướng đến /server.
- Chạy lệnh sau để khởi tạo ứng dụng và database:

```bash
npm install
npx prisma db push
npm run dev
```

## Bước 7: Tobe continue...
