# Spec: Trang Sự Kiện & RSVP Thiệp Cưới Online

- **Loại tài liệu**: Feature Specification (Spec-Driven Development)
- **Phiên bản**: 0.1 (Draft)
- **Ngày tạo**: 2026-09-18
- **Chủ sở hữu**: (điền tên cô dâu/chú rể hoặc người phụ trách)

---

## 1. Tổng quan (Overview)

Xây dựng một trang web thiệp cưới online, dùng để:
1. Giới thiệu thông tin sự kiện lễ cưới (thời gian, địa điểm, timeline).
2. Cho phép khách mời xác nhận tham dự (RSVP).
3. Trưng bày album ảnh cưới.
4. Chỉ đường tới địa điểm tổ chức.

**Phạm vi hiện tại (v0.1)**: Chỉ làm **giao diện (frontend)**, chưa cần backend lưu trữ dữ liệu RSVP. Form RSVP hiển thị đầy đủ UI/UX nhưng dữ liệu nhập vào chưa cần được gửi/lưu vào đâu (có thể log ra console hoặc lưu tạm trong state, không cần persist).

**Ngoài phạm vi (Out of scope) v0.1**:
- Không cần database (Google Sheets, Firebase, Supabase...).
- Không cần gửi email/SMS xác nhận.
- Không cần trang quản trị (admin dashboard) để xem danh sách khách.
- Không cần chức năng gửi mừng cưới online (chưa chọn).
- Không cần đa ngôn ngữ, sổ lời chúc, đếm ngược (chưa chọn, có thể bổ sung ở version sau).

---

## 2. Đối tượng người dùng (User Personas)

| Persona | Mô tả | Mục tiêu |
|---|---|---|
| Khách mời | Nhận link thiệp cưới, xem trên điện thoại là chủ yếu | Xem thông tin sự kiện nhanh, RSVP dễ dàng, xem đường đi |
| Cô dâu/Chú rể (chủ sở hữu trang) | Người chia sẻ link cho khách | Trang đẹp, dễ chia sẻ, thể hiện đúng phong cách cá nhân |

---

## 3. Tính năng cốt lõi (Functional Requirements)

### 3.1 RSVP — Xác nhận tham dự
- **FR-1.1**: Form RSVP thu thập: Tên khách mời, Số điện thoại, Số lượng người tham dự.
- **FR-1.2**: Khách chọn "Tham dự" hoặc "Không thể tham dự".
- **FR-1.3**: Validate cơ bản: Tên không rỗng, SĐT đúng định dạng VN, số lượng người ≥ 1 (nếu chọn tham dự).
- **FR-1.4**: Sau khi submit, hiển thị màn hình/thông báo cảm ơn (confirmation state), không cần gọi API thật — có thể giả lập (mock submit).
- **FR-1.5** *(Open question)*: Có cần giới hạn số lượng người đi kèm tối đa không? (VD: tối đa 2 người/thiệp)

### 3.2 Lịch trình sự kiện (Timeline)
- **FR-2.1**: Hiển thị timeline các mốc thời gian trong ngày cưới (VD: Lễ đón khách, Lễ thành hôn, Tiệc cưới...).
- **FR-2.2**: Mỗi mốc gồm: Giờ, Tên hoạt động, Mô tả ngắn (tuỳ chọn), Icon (tuỳ chọn).
- **FR-2.3**: Responsive tốt trên mobile (dạng dọc/vertical timeline).

### 3.3 Bản đồ chỉ đường (Location/Map)
- **FR-3.1**: Hiển thị tên địa điểm, địa chỉ đầy đủ.
- **FR-3.2**: Nhúng bản đồ (Google Maps embed hoặc link "Chỉ đường" mở Google Maps app).
- **FR-3.3**: Nếu có nhiều địa điểm (VD: lễ ở nhà thờ, tiệc ở nhà hàng) → hiển thị từng địa điểm riêng biệt.

### 3.4 Album ảnh cưới
- **FR-4.1**: Hiển thị lưới ảnh (gallery grid), responsive.
- **FR-4.2**: Click vào ảnh → xem full-size (lightbox/modal).
- **FR-4.3**: Hỗ trợ số lượng ảnh linh hoạt (dễ thêm/bớt ảnh).
- **FR-4.4** *(Open question)*: Có cần thêm video (VD: prewedding video) không?

---

## 4. Giao diện (UI/UX)

> ⚠️ **Open Question**: File `DESIGN.md` chưa được cung cấp. Phần này là **placeholder** — cần cập nhật khi có file thiết kế, hoặc trả lời nhanh các câu hỏi bên dưới để mình bổ sung.

**Cần làm rõ thêm** (điền vào để hoàn thiện spec):
- [ ] Phong cách thị giác: tối giản / lãng mạn-hoa văn / hiện đại-đậm / cổ điển-sang trọng?
- [ ] Bảng màu chủ đạo (nếu có, VD: be - vàng đồng, xanh sage, hồng pastel...)
- [ ] Font chữ mong muốn (nếu có gu riêng)
- [ ] Có ảnh/logo/monogram của cặp đôi để làm điểm nhấn không?
- [ ] Bố cục: 1 trang dài (single-page scroll) hay nhiều section/tab?

**Yêu cầu kỹ thuật giao diện chung**:
- **FR-5.1**: Responsive, ưu tiên trải nghiệm mobile-first (đa số khách xem trên điện thoại qua link chia sẻ Zalo/Messenger).
- **FR-5.2**: Có hiệu ứng chuyển động nhẹ nhàng (fade-in, scroll animation) tăng cảm giác sang trọng, không gây rối mắt.
- **FR-5.3**: Tốc độ tải trang nhanh, tối ưu ảnh.

---

## 5. Dữ liệu (Data)

- **DR-1**: Đây là bản v0.1 **frontend-only** — không có backend, không có database.
- **DR-2**: Dữ liệu sự kiện (tên cô dâu/chú rể, ngày giờ, địa điểm, timeline, danh sách ảnh) được khai báo **cứng (hardcoded)** trong code hoặc file cấu hình JSON/JS đơn giản, dễ chỉnh sửa thủ công.
- **DR-3**: Dữ liệu RSVP khách nhập vào: không persist — chỉ lưu tạm trong local state của form để hiển thị màn hình cảm ơn, sau khi refresh trang sẽ mất (điều này chấp nhận được ở v0.1).
- **DR-4 (Future/Out of scope)**: Khi cần lưu trữ thật, có thể nâng cấp bằng Google Sheets (qua Apps Script API) hoặc Firebase/Supabase — sẽ làm spec riêng khi cần.

---

## 6. Yêu cầu phi chức năng (Non-Functional Requirements)

- **NFR-1**: Hỗ trợ tốt trên trình duyệt mobile (Safari iOS, Chrome Android).
- **NFR-2**: Thời gian tải trang ban đầu < 3s trên mạng 4G.
- **NFR-3**: Trang phải hiển thị tốt khi chia sẻ preview link qua Zalo/Facebook/Messenger (Open Graph meta tags: tiêu đề, mô tả, ảnh đại diện).
- **NFR-4**: Dễ dàng chỉnh sửa nội dung (tên, ngày giờ, địa điểm, ảnh) mà không cần sửa nhiều code.

---

## 7. Câu hỏi mở / Cần quyết định thêm (Open Questions)

1. Phong cách giao diện cụ thể (chờ `DESIGN.md` hoặc trả lời nhanh).
2. Có giới hạn số người đi kèm khi RSVP không?
3. Có cần thêm video prewedding vào album không?
4. Tên miền/cách chia sẻ link: dùng tên miền riêng hay chia sẻ qua link tạm?
5. Ngôn ngữ hiển thị: chỉ tiếng Việt hay cần thêm tiếng Anh?

---

## 8. Bước tiếp theo (Next Steps)

1. Xác nhận/bổ sung phần **Giao diện (Section 4)** bằng cách gửi `DESIGN.md` hoặc trả lời các câu hỏi mở.
2. Từ `spec.md` này, sinh ra `plan.md` (kiến trúc kỹ thuật, cấu trúc thư mục, component breakdown).
3. Từ `plan.md`, sinh ra `tasks.md` (danh sách task cụ thể để implement).