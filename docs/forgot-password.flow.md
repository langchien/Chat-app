# Forgot Password Flow

1. **User gửi yêu cầu quên mật khẩu**

   - Gửi email tới server (API: /auth/forgot-password)

2. **Server gửi email chứa OTP**

   - Server tạo OTP và gửi về email của user

3. **User nhập OTP**

   - Gửi OTP lên server để xác thực (API: /auth/verify-otp)

4. **Server xác thực OTP**

   - Nếu đúng, server trả về `forgotPasswordToken` (JWT)

5. **User cập nhật mật khẩu mới**

   - Gửi mật khẩu mới cùng `forgotPasswordToken` lên server (API: /auth/reset-password)

6. **Server cập nhật mật khẩu**
   - Nếu token hợp lệ, cập nhật mật khẩu mới cho user

## Ưu điểm của Flow này

### 1. Bảo mật cao

- ✅ **JWT có chữ ký số**: Không thể giả mạo hoặc chỉnh sửa payload
- ✅ **Tamper-proof**: Mọi thay đổi đều làm token invalid
- ✅ **Không lưu sensitive data**: Không cần lưu verification token vào database
- ✅ **Tự động expire**: Token tự hủy sau thời gian nhất định (15-30 phút)

### 2. Stateless & Hiệu năng

- ✅ **Không cần query database** để verify token
- ✅ **Giảm tải cho database**: Chỉ cần verify signature
- ✅ **Scalable**: Dễ scale horizontal vì không phụ thuộc server state
- ✅ **Fast validation**: Verify JWT nhanh hơn query DB

### 3. Tự chứa thông tin

- ✅ **Payload chứa mọi thông tin cần thiết**: email, otp, expiration
- ✅ **Không cần thêm API call**: Server có thể extract data trực tiếp
- ✅ **Dễ debug**: Có thể decode JWT để xem payload (jwt.io)
  > ℹ️ Ghi chú: README này được tạo bởi Github Copilot theo yêu cầu của @langtien.
