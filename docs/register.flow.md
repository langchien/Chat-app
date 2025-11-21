# Flow đăng ký với JWT Token (Email Verification)

## Quy trình

1. **User nhập email** → Server gửi OTP qua email (6 chữ số)
2. **User nhập OTP** → Server verify OTP
3. **Server tạo JWT token** (email verified token) với:
   - payload: `{ email, otp, type: 'EMAIL_VERIFIED' }`
   - expiration: 15-30 phút
4. **Client lưu JWT** và gửi kèm khi đăng ký (trong header hoặc body)
5. **Server verify JWT** → Cho phép đăng ký tài khoản

---

## Ưu điểm của Flow này

### 1. **Bảo mật cao (Security)**

- ✅ **JWT có chữ ký số**: Không thể giả mạo hoặc chỉnh sửa payload
- ✅ **Tamper-proof**: Mọi thay đổi đều làm token invalid
- ✅ **Không lưu sensitive data**: Không cần lưu verification token vào database
- ✅ **Tự động expire**: Token tự hủy sau thời gian nhất định (15-30 phút)

**So sánh với Random String:**

- ❌ Random string phải lưu vào database → Tăng attack surface
- ❌ Dễ bị brute force nếu string ngắn
- ❌ Cần implement logic expire riêng

### 2. **Stateless & Hiệu năng (Performance)**

- ✅ **Không cần query database** để verify token
- ✅ **Giảm tải cho database**: Chỉ cần verify signature
- ✅ **Scalable**: Dễ scale horizontal vì không phụ thuộc server state
- ✅ **Fast validation**: Verify JWT nhanh hơn query DB

**So sánh với Random String:**

- ❌ Mỗi request phải query database để check validity
- ❌ Tăng load cho database khi traffic cao
- ❌ Khó scale khi dùng session-based

### 3. **Tự chứa thông tin (Self-contained)**

- ✅ **Payload chứa mọi thông tin cần thiết**: email, otp, expiration
- ✅ **Không cần thêm API call**: Server có thể extract data trực tiếp
- ✅ **Dễ debug**: Có thể decode JWT để xem payload (jwt.io)

**So sánh với Random String:**

- ❌ Chỉ là một chuỗi ngẫu nhiên, không chứa context
- ❌ Phải query DB để lấy thông tin liên quan (email, expiry)

---

## Khi nào KHÔNG nên dùng JWT?

1. **Cần revoke token ngay lập tức**: JWT không thể revoke trước khi expire (trừ khi dùng blacklist)
2. **Token quá lớn**: Nếu payload chứa quá nhiều data
3. **Cần track user sessions chặt chẽ**: JWT stateless nên khó track realtime

→ Nhưng với use case **email verification**, JWT là lựa chọn tối ưu!

---

## Security Notes

⚠️ **Lưu ý quan trọng:**

- Không lưu JWT vào localStorage (dễ bị XSS)
- Nên lưu vào memory hoặc sessionStorage
- Dùng HTTPS để truyền token
- Secret key phải đủ mạnh (ít nhất 256 bit)
- Thời gian expire không quá dài (15-30 phút là hợp lý)

> ℹ️ Ghi chú: README này được tạo bởi Github Copilot theo yêu cầu của @langtien.
