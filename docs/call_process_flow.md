# Quy trình Gọi Voice/Video Call

Quy trình hoạt động của tính năng gọi điện (Voice/Video) trong ứng dụng Chat, bao gồm sự tương tác giữa 4 thực thể chính: **Người dùng (User)**, **Client (Ứng dụng Frontend)**, **Server (Socket.IO)** và **Bên thứ 3 (STUN/TURN Servers)**.

## Sơ đồ tổng quan

```mermaid
sequenceDiagram
    participant U1 as User A (Caller)
    participant C1 as Client A
    participant S as Server (Socket.IO)
    participant C2 as Client B (Receiver)
    participant U2 as User B
    participant ICE as STUN/TURN Servers

    Note over U1, U2: 1. Bắt đầu cuộc gọi
    U1->>C1: Nhấn nút gọi (Voice/Video)
    C1->>C1: getUserMedia (Camera/Mic)
    C1->>C1: Tạo PeerConnection (PC)
    C1->>C1: Tạo Offer
    C1->>S: emit("call-user", to: UserB, offer)

    Note over S: 2. Signaling (Offer)
    S->>S: Tìm socketId của User B
    S->>C2: emit("call-made", offer, from: UserA)

    Note over U2, C2: 3. Nhận cuộc gọi
    C2->>U2: Hiển thị Modal "Incoming Call"
    U2->>C2: Nhấn "Trả lời"
    C2->>C2: getUserMedia (Camera/Mic)
    C2->>C2: Tạo PeerConnection (PC)
    C2->>C2: Set RemoteDescription (Offer)
    C2->>C2: Tạo Answer
    C2->>S: emit("make-answer", to: UserA, answer)

    Note over S: 4. Signaling (Answer)
    S->>C1: emit("answer-made", answer)
    C1->>C1: Set RemoteDescription (Answer)

    Note over C1, C2: 5. Kết nối P2P (ICE Candidates)
    par Candidate A
        C1->>ICE: Lấy ICE Candidates
        ICE-->>C1: Candidate Found
        C1->>S: emit("ice-candidate", candidate)
        S->>C2: emit("ice-candidate", candidate)
        C2->>C2: addIceCandidate(candidate)
    and Candidate B
        C2->>ICE: Lấy ICE Candidates
        ICE-->>C2: Candidate Found
        C2->>S: emit("ice-candidate", candidate)
        S->>C1: emit("ice-candidate", candidate)
        C1->>C1: addIceCandidate(candidate)
    end

    Note over C1, C2: 6. Media Stream (Connected)
    C1<-->C2: Trao đổi Media Stream (Video/Audio) trực tiếp

    Note over U1, U2: 7. Kết thúc
    U1->>C1: Nhấn "Huỷ/Tắt máy"
    C1->>S: emit("hang-up", to: UserB)
    S->>C2: emit("hang-up")
    C1->>C1: Stop Stream & Close PC
    C2->>C2: Stop Stream & Close PC
```

## Chi tiết các bước

### 1. Khởi tạo (User A - Người gọi)

- **Hành động**: Người dùng nhấn nút gọi điện.
- **Client A**:
  - Gọi `navigator.mediaDevices.getUserMedia` để lấy video và audio từ thiết bị.
  - Tạo một đối tượng `RTCPeerConnection` mới với các cấu hình ICE Servers (Google/Twilio).
  - Thêm các luồng dữ liệu (tracks) từ stream vào PeerConnection.
  - Tạo SDP Offer (`createOffer`) và đặt làm Local Description.
  - Gửi sự kiện Socket `call-user` lên Server kèm theo Offer và ID của người nhận.

### 2. Định tuyến (Server)

- **Server**:
  - Nhận sự kiện `call-user`.
  - Tìm kiếm thông tin Socket ID của người nhận (User B) trong danh sách người dùng đang online.
  - Nếu tìm thấy, bắn sự kiện `call-made` xuống Client B kèm theo Offer và thông tin người gọi.

### 3. Phản hồi (User B - Người nhận)

- **Client B**:
  - Nhận sự kiện `call-made`.
  - Hiển thị thông báo (Modal) có cuộc gọi đến cho User B.
- **Hành động**: User B nhấn nút "Trả lời".
- **Client B**:
  - Yêu cầu quyền truy cập Camera/Mic (`getUserMedia`).
  - Tạo `RTCPeerConnection`.
  - Thiết lập Offer từ User A làm Remote Description.
  - Tạo SDP Answer (`createAnswer`) và đặt làm Local Description.
  - Gửi sự kiện Socket `make-answer` lên Server.

### 4. Thiết lập kết nối (Signaling Complete)

- **Server**:
  - Chuyển tiếp `make-answer` thành sự kiện `answer-made` gửi về cho Client A.
- **Client A**:
  - Nhận `answer-made` và thiết lập Answer làm Remote Description.
  - Lúc này, quá trình Signaling (trao đổi Offer/Answer) hoàn tất.

### 5. Tìm đường (ICE Candidates)

- Song song với quá trình Signaling, cả hai Client liên tục giao tiếp với máy chủ **STUN/TURN** (Dịch vụ bên thứ 3) để tìm các ứng viên kết nối (ICE Candidates - IP public, port, protocol...).
- Khi tìm thấy Candidate, Client gửi sự kiện `ice-candidate` qua Server để chuyển cho đối phương.
- Đối phương nhận được Candidate sẽ thêm vào PeerConnection của mình thông qua `addIceCandidate`.

### 6. Kết nối Media (P2P)

- Khi đủ thông tin ứng viên (Candidates) và đường đi tốt nhất được chọn, kết nối Peer-to-Peer được thiết lập.
- `RTCPeerConnection` chuyển trạng thái sang `connected`.
- Media Stream (Âm thanh/Hình ảnh) được truyền trực tiếp giữa Client A và Client B mà không đi qua Server Socket (trừ trường hợp dùng TURN server làm relay nếu mạng bị chặn).

### 7. Kết thúc

- Khi một trong hai bên nhấn nút tắt máy (`hangUp`).
- Client gửi sự kiện `hang-up` qua Server.
- Server báo cho bên còn lại sự kiện `hang-up`.
- Cả hai Client thực hiện dọn dẹp: Tắt Camera/Mic, đóng PeerConnection, reset trạng thái giao diện.
