# Refresh Token Flow

## Overview

Sử dụng refresh token để lấy access token mới mà không cần đăng nhập lại. Áp dụng **token rotation** với thời gian hết hạn giữ nguyên từ token cũ.

## Steps

### 1. Client Request

- **Endpoint**: `POST /api/auth/refresh`
- **Body**: `{ refreshToken: string }`

### 2. Server Processing

1. **Verify JWT signature** - Xác thực token hợp lệ
2. **Query Redis** - `GET token:{refreshToken}` kiểm tra token có tồn tại không
3. **Check expiration** - Token đã hết hạn chưa (Redis tự động xóa nếu hết hạn)
4. **Delete old token** - `DEL token:{refreshToken}` xóa token cũ (token rotation)
5. **Generate new tokens** - Tạo access token + refresh token mới (⚠️ giữ nguyên exp từ token cũ)
6. **Save new refresh token** - `SET token:{newRefreshToken} {userId} EX {ttl}` lưu vào Redis với TTL
7. **Return tokens** - Trả về tokens mới cho client

### 3. Response

- **Success**: `{ accessToken, refreshToken }`
- **Error**: `401 Unauthorized` nếu token không hợp lệ/hết hạn

## Redis Storage

**Key Pattern**: `token:{refreshToken}`

**Value**: `userId` hoặc JSON object `{ userId, createdAt }`

**TTL**: Thời gian hết hạn tính từ token gốc (VD: 7 ngày)

**Advantages**:

- ⚡ **Fast lookup** - In-memory, millisecond response time
- 🗑️ **Auto cleanup** - Redis tự động xóa key khi hết TTL
- 📊 **Easy multi-device** - `KEYS user:{userId}:*` để query tất cả tokens của user
- 💾 **Low overhead** - Không cần index, không cần migration

## Security Notes

### ✅ Ưu điểm:

- **Token rotation** - Mỗi lần refresh đều tạo token mới
- **Revocation** - Có thể thu hồi token bất kỳ lúc nào
- **Detect reuse** - Phát hiện nếu token cũ bị dùng lại
- **Hard session limit** - User phải login lại sau exp ban đầu

### ⚠️ Trade-offs:

- Session không gia hạn - User phải login lại sau thời gian exp gốc
- ~~DB query overhead mỗi lần refresh~~ ✅ Redis cực nhanh
- Cần Redis instance để lưu tokens

## Related Features

- **Logout**: `DEL token:{refreshToken}` - Xóa refresh token khỏi Redis
- **Logout All Devices**: `DEL user:{userId}:*` - Xóa tất cả tokens của user (nếu dùng pattern `user:{userId}:{token}`)
- **Auto Cleanup**: Redis tự động xóa key hết TTL, không cần cron job

  > ℹ️ Ghi chú: README này được tạo bởi Github Copilot theo yêu cầu của @langtien.
