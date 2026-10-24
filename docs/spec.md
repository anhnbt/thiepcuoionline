# Spec: Trang Sự Kiện & RSVP Thiệp Cưới Online

## 1. Sản phẩm & người dùng

Trang web thiệp cưới online cho cặp đôi **Tuấn Anh & Hoa**, giải quyết nhu cầu:
* Khách mời xem thông tin ngày cưới, địa điểm, lịch trình chi tiết và album ảnh trực tiếp trên điện thoại (chủ yếu mở qua Zalo, Facebook Messenger).
* Khách mời xác nhận tham dự (RSVP) nhanh chóng, dễ dàng mà không cần tạo tài khoản hay cài đặt ứng dụng.
* Khách mời dễ dàng lưu sự kiện ngày cưới vào Google Calendar để không bị quên lịch.

## 2. Phạm vi MVP

* **Làm:**
  * Thông tin sự kiện và lịch trình đám cưới (ngày **26/12/2026**, từ 17:00 đến 21:30).
  * Form xác nhận tham dự (RSVP).
  * Bản đồ chỉ đường tới địa điểm tổ chức.
  * Album ảnh cưới (xem phóng to ảnh).
  * **Tính năng "Thêm vào lịch Google Calendar"**: Nút bấm mở tab tạo sự kiện Google Calendar với thông tin điền sẵn (tại khu vực Lịch trình/Sự kiện và màn hình cảm ơn sau RSVP).
* **Cố tình chưa làm:**
  * Tải tệp `.ics` hoặc tích hợp trực tiếp Apple Calendar / Outlook Calendar (giữ MVP gọn nhẹ).
  * Mừng cưới online, quét mã QR thanh toán.
  * Đếm số lượng mâm cỗ.
  * Chatbox trực tiếp hoặc sổ lời chúc online.

## 3. Tính năng

### 3.1 Thêm vào lịch Google Calendar

* Khi khách bấm nút *"Thêm vào Google Calendar"* (tại khu vực Lịch trình sự kiện hoặc màn hình cảm ơn sau RSVP), trình duyệt mở một tab mới (`target="_blank"`, `rel="noopener noreferrer"`) dẫn tới trang tạo sự kiện của Google Calendar.
* Khi trang Google Calendar mở ra, các trường sự kiện được điền sẵn đầy đủ:
  * **Tiêu đề:** Đám cưới Tuấn Anh & Hoa.
  * **Thời gian:** 17:00 - 21:30, ngày 26/12/2026 (múi giờ GMT+7, Asia/Ho_Chi_Minh).
  * **Địa điểm:** Trung tâm Tiệc cưới Trống Đồng Palace Linh Đàm, Khu đô thị Bán đảo Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội.
  * **Mô tả/Chi tiết:** Lời mời đám cưới kèm đường dẫn website thiệp cưới.
* Khi khách bấm "Lưu" (Save) trên Google Calendar, sự kiện được ghi nhận vào lịch cá nhân của khách.

### 3.2 Xác nhận tham dự (RSVP)

* Khi khách để trống Tên hoặc nhập sai định dạng Số điện thoại Việt Nam thì form báo lỗi, không cho gửi.
* Khi khách gửi form thành công, hệ thống chuyển sang màn hình/thông báo cảm ơn và hiển thị nút nhắc *"Thêm vào Google Calendar"*.

### 3.3 Lịch trình sự kiện (Timeline)

* Hiển thị dòng thời gian các mốc từ 17:00 đón khách, 17:45 lễ thành hôn, 18:15 khai tiệc, 19:30 giao lưu âm nhạc đến 20:30 cảm tạ.

### 3.4 Bản đồ chỉ đường (Location)

* Hiển thị địa chỉ chi tiết và nút mở chỉ đường qua Google Maps.

### 3.5 Album ảnh cưới (Gallery)

* Hiển thị lưới ảnh cưới tối ưu trên điện thoại, hỗ trợ bấm vào để xem ảnh kích thước lớn (lightbox/modal).

## 4. Dữ liệu & vai trò

### Dữ liệu sự kiện & Lịch

| Trường dữ liệu | Nguồn dữ liệu | Giá trị mặc định |
|---|---|---|
| Tiêu đề sự kiện | `weddingData` | Đám cưới Tuấn Anh & Hoa |
| Thời gian bắt đầu | `weddingData.event` | 2026-12-26 17:00 (GMT+7) |
| Thời gian kết thúc | `weddingData.event` | 2026-12-26 21:30 (GMT+7) |
| Địa điểm tổ chức | `weddingData.venues[0]` | Trống Đồng Palace Linh Đàm, Hoàng Mai, Hà Nội |
| Đường dẫn URL | URL website thực tế | Đường dẫn website thiệp cưới |

### Phân quyền vai trò

| Vai trò | Xem thông tin & Bấm thêm Calendar | Gửi RSVP | Quản trị dữ liệu |
|---|---|---|---|
| **Khách mời** (Mọi người truy cập) | Có (tại mục Lịch trình & sau RSVP) | Có | Không |
| **Admin / Chủ tiệc** | Có | Có | Xem danh sách RSVP (ở giai đoạn sau) |

## 5. Trường hợp biên

* **Khách mở từ trình duyệt nhúng (in-app browser) của Zalo / Facebook Messenger:**
  * Sử dụng liên kết web tiêu chuẩn `https://calendar.google.com/calendar/render?action=TEMPLATE...` mở tab mới để đảm bảo tính tương thích; nếu chưa đăng nhập Google, trang Google sẽ yêu cầu đăng nhập trước khi hiển thị form sự kiện.
* **Lệch múi giờ thiết bị:**
  * Khóa cứng tham số múi giờ `ctz=Asia/Ho_Chi_Minh` hoặc định dạng giờ UTC chuẩn (`20261226T100000Z/20261226T143000Z`) để tránh trường hợp điện thoại khách đặt lệch múi giờ làm sai thời gian đám cưới.
* **Ký tự tiếng Việt có dấu:**
  * Toàn bộ nội dung tiêu đề, địa điểm, mô tả đều được mã hoá URL chuẩn (`encodeURIComponent`) để không bị lỗi font hoặc đứt gãy liên kết trên di động.
* **Khách dùng iPhone không dùng Google Calendar:**
  * Link vẫn mở giao diện web của Google Calendar bình thường trong Safari; khách có thể đăng nhập tài khoản Google để lưu. (Hỗ trợ file `.ics` cho Apple Calendar sẽ xem xét ở giai đoạn sau).

## 6. Câu hỏi còn mở

1. Có cần làm thêm nút tải file `.ics` (iCalendar) cho khách dùng iPhone muốn lưu trực tiếp vào ứng dụng Lịch mặc định của Apple không? (Đã tạm hoãn ở MVP).