# Hướng Dẫn Build và Cài Đặt App lên iPhone 13

## Tổng quan

Đây là hướng dẫn chi tiết từng bước để build **Development Build** cho ứng dụng Agribank Digital Guard và cài đặt lên iPhone 13.

**Lưu ý quan trọng:**
- Bạn đang dùng Windows, nhưng để build iOS app cần có máy Mac hoặc sử dụng EAS Build (cloud build)
- Hướng dẫn này sử dụng **EAS Build** - build trên cloud của Expo, không cần máy Mac
- Cần có **Apple Developer Account** (có thể dùng tài khoản miễn phí hoặc trả phí $99/năm)

---

## Bước 1: Cài đặt các công cụ cần thiết (trên Windows)

### 1.1. Cài đặt Node.js
```powershell
# Tải và cài đặt Node.js từ https://nodejs.org (phiên bản LTS)
# Sau khi cài, kiểm tra bằng:
node --version
npm --version
```

### 1.2. Cài đặt EAS CLI
```powershell
npm install -g eas-cli
```

### 1.3. Cài đặt Expo CLI
```powershell
npm install -g expo-cli
```

---

## Bước 2: Đăng nhập Expo và Apple Developer

### 2.1. Tạo tài khoản Expo (nếu chưa có)
1. Truy cập https://expo.dev/signup
2. Đăng ký tài khoản miễn phí

### 2.2. Đăng nhập EAS CLI
```powershell
cd mobile-app
eas login
# Nhập email và mật khẩu Expo của bạn
```

### 2.3. Liên kết dự án với Expo
```powershell
eas init
# Chọn "Create a new EAS project" nếu được hỏi
# Ghi lại Project ID được tạo ra
```

---

## Bước 3: Cài đặt dependencies

```powershell
cd mobile-app
npm install
```

---

## Bước 4: Cấu hình Apple Developer Account

### 4.1. Đăng ký Apple Developer (nếu chưa có)

**Option A: Tài khoản miễn phí (giới hạn)**
- Truy cập https://developer.apple.com
- Đăng nhập bằng Apple ID
- Chấp nhận điều khoản Developer Agreement
- *Lưu ý: Tài khoản miễn phí chỉ cho phép cài app lên device trong 7 ngày*

**Option B: Apple Developer Program ($99/năm - KHUYẾN NGHỊ)**
- Truy cập https://developer.apple.com/programs/
- Đăng ký Apple Developer Program
- *Ưu điểm: App không hết hạn, có thể distribute cho nhiều thiết bị*

### 4.2. Đăng ký thiết bị iPhone 13

1. Kết nối iPhone 13 với máy tính qua cáp USB
2. Trên iPhone, vào **Settings > General > About**
3. Ghi lại **UDID** của thiết bị (có thể dùng iTunes hoặc Finder trên Mac để xem)

**Cách lấy UDID không cần Mac:**
1. Trên iPhone, truy cập https://udid.tech hoặc https://get.udid.io
2. Làm theo hướng dẫn để lấy UDID
3. Sao chép UDID (dạng: 00008110-XXXXXXXXXXXX)

---

## Bước 5: Build Development Build cho iOS

### 5.1. Đăng ký thiết bị với EAS
```powershell
eas device:create
# Nhập UDID của iPhone 13 của bạn
# Đặt tên thiết bị (ví dụ: "iPhone 13 Demo")
```

### 5.2. Bắt đầu build
```powershell
eas build --profile development --platform ios
```

Khi được hỏi:
- **Apple ID**: Nhập Apple ID của bạn
- **Password**: Nhập mật khẩu Apple ID
- **2FA Code**: Nhập mã xác thực 2 bước (nếu có)
- **Team**: Chọn team của bạn (thường chỉ có 1 option)
- **Provisioning Profile**: Chọn "Let EAS handle it" (để EAS tự động tạo)
- **Distribution Certificate**: Chọn "Let EAS handle it"

### 5.3. Chờ build hoàn thành
- Build thường mất **15-30 phút**
- Bạn có thể theo dõi tiến trình tại link được hiển thị
- Hoặc dùng lệnh: `eas build:list`

---

## Bước 6: Cài đặt app lên iPhone 13

### 6.1. Tải file IPA
Sau khi build hoàn thành, EAS sẽ cung cấp:
- **QR Code**: Quét bằng camera iPhone để tải
- **Download Link**: Hoặc truy cập link để tải

### 6.2. Cài đặt qua Expo Dashboard
1. Truy cập https://expo.dev
2. Vào project của bạn
3. Tab **Builds** > Tìm build vừa xong
4. Dùng iPhone quét **QR code** để cài đặt

### 6.3. Trust Developer Certificate (quan trọng!)
Sau khi cài app, bạn cần trust developer certificate:

1. Trên iPhone, vào **Settings** (Cài đặt)
2. Chọn **General** (Cài đặt chung)
3. Chọn **VPN & Device Management** (hoặc **Profiles & Device Management**)
4. Tìm và chọn developer profile của bạn
5. Nhấn **Trust** (Tin cậy)
6. Xác nhận **Trust** một lần nữa

---

## Bước 7: Chạy app với Development Server

### 7.1. Khởi động Development Server (trên Windows)
```powershell
cd mobile-app
npx expo start --dev-client
```

### 7.2. Kết nối iPhone với Development Server
1. Đảm bảo iPhone và máy tính Windows **cùng mạng WiFi**
2. Mở app **Agribank Digital Guard** trên iPhone
3. App sẽ tự động kết nối với development server
4. Hoặc nhập URL thủ công: `exp://192.168.x.x:8081`

---

## Bước 8: Demo trước Hội đồng

### 8.1. Chuẩn bị trước buổi demo

**Về mạng:**
- Đảm bảo có WiFi ổn định
- Laptop và iPhone cùng mạng WiFi
- Test kết nối trước 30 phút

**Về Backend:**
- Chạy backend server:
  ```powershell
  cd backend
  npm install
  npm start
  ```
- Đảm bảo backend hoạt động tại `http://YOUR_IP:5000`

**Về App:**
- Khởi động development server
- Mở app trên iPhone
- Test các tính năng:
  - [ ] Chọn ngôn ngữ
  - [ ] Gửi tin nhắn text
  - [ ] Nhấn nút 🎤 để ghi âm và nhận diện giọng nói
  - [ ] Nhấn nút 🔊 để nghe bot đọc câu trả lời

### 8.2. Các tính năng đã được tích hợp

| Tính năng | Mô tả | Không cần API |
|-----------|-------|---------------|
| **Text-to-Speech (TTS)** | Đọc text bằng giọng nói | ✅ Dùng expo-speech (native iOS) |
| **Speech-to-Text (STT)** | Nhận diện giọng nói | ✅ Dùng react-native-voice (native iOS) |
| **Chatbot** | Trả lời câu hỏi về lừa đảo | ⚠️ Vẫn cần backend server |

### 8.3. Backup plan (nếu gặp sự cố)

**Nếu STT không hoạt động:**
- Sử dụng nhập text thủ công
- Giải thích: "Tính năng nhận diện giọng nói cần internet ổn định"

**Nếu TTS không hoạt động:**
- Đọc text thủ công cho hội đồng
- Kiểm tra: Settings > Accessibility > Spoken Content

**Nếu không kết nối được development server:**
- Sử dụng **Production Build** thay vì Development Build
- Build production: `eas build --profile production --platform ios`

---

## Troubleshooting (Xử lý sự cố)

### Lỗi: "Device not registered"
```powershell
eas device:create
# Thêm UDID của iPhone vào danh sách thiết bị
# Sau đó build lại
```

### Lỗi: "Provisioning profile không hợp lệ"
```powershell
eas credentials
# Chọn iOS > Provisioning Profile > Create new
```

### Lỗi: "Apple ID require 2FA"
- Bật 2FA cho Apple ID tại https://appleid.apple.com
- Hoặc tạo app-specific password

### Lỗi: "Build failed"
```powershell
# Xem log chi tiết
eas build:view
# Hoặc build lại với verbose
eas build --profile development --platform ios --clear-cache
```

### Lỗi: Không nghe được TTS
1. Kiểm tra âm lượng iPhone
2. Vào Settings > Accessibility > Spoken Content
3. Bật "Speak Selection"
4. Đảm bảo có voice tiếng Việt đã tải

### Lỗi: STT không nhận diện được
1. Kiểm tra quyền microphone: Settings > Privacy > Microphone
2. Kiểm tra quyền Speech Recognition: Settings > Privacy > Speech Recognition
3. Đảm bảo iPhone có kết nối internet (STT native vẫn cần internet)

---

## Tổng kết các lệnh quan trọng

```powershell
# Đăng nhập EAS
eas login

# Khởi tạo project
eas init

# Đăng ký thiết bị
eas device:create

# Build development
eas build --profile development --platform ios

# Xem danh sách builds
eas build:list

# Chạy development server
npx expo start --dev-client

# Build production (không cần dev server)
eas build --profile production --platform ios
```

---

## Liên hệ hỗ trợ

Nếu gặp vấn đề, có thể tham khảo:
- Expo Documentation: https://docs.expo.dev
- EAS Build Guide: https://docs.expo.dev/build/introduction/
- Expo Discord: https://chat.expo.dev

---

**Chúc bạn demo thành công!** 🎉
