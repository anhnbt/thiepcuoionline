# GEMINI.md — Thiệp cưới Nam & Lan

> **Tệp này đặt ở GỐC dự án** (ngang hàng `package.json`), không để trong `/docs`.
> Antigravity IDE và Gemini CLI tự động đọc tệp này ở mỗi phiên làm việc. Bạn không cần
> dán lại nội dung vào khung chat. Dùng Claude Code thì đổi tên tệp thành `CLAUDE.md`,
> nội dung giữ nguyên.
>
> Đây là **bộ nhớ dài hạn của dự án**: những gì bạn phải nhắc AI đi nhắc lại mỗi ngày
> thì viết một lần vào đây.

**Quy ước:** chỗ nào ghi `CHƯA ĐIỀN` là tôi chưa kịp điền. Gặp giá trị đó thì **đừng đoán
và đừng bỏ qua** — hãy tự đọc `package.json` rồi đề xuất giá trị đúng cho tôi xác nhận,
sau đó nhắc tôi cập nhật lại vào tệp này.

---

## 1. Dự án này là gì

Landing page thiệp cưới online cho cặp đôi **Nam & Lan**, ngày cưới **25/12/2026**.
Tính năng trung tâm là **RSVP** — khách mời bấm xác nhận có tới dự hay không.

Người dùng là **khách mời được mời cưới**, phần lớn mở link từ điện thoại qua Zalo
hoặc Facebook. Họ không rành công nghệ. Trang phải đọc được ngay, không bắt đăng nhập,
không bắt tải app.

**Phạm vi MVP — những thứ KHÔNG làm ở phiên bản này:**

* Không thanh toán mừng cưới online.
* Không đếm số mâm cỗ.
* Không chatbox trực tiếp.
* Không trang quản trị, không đăng nhập (sẽ có ở Buổi 5).

Nếu tôi nhờ bạn thêm một tính năng nằm ngoài danh sách trên, **hãy hỏi lại tôi trước
khi viết code**, đừng tự ý làm.

---

## 2. Lệnh thường dùng

> **PHẦN PHẢI ĐIỀN LẠI.** Mở `package.json`, xem mục `scripts` có gì thì ghi vào đây.
> Mã nguồn tải từ v0.app mỗi người một khác, đừng giữ nguyên phần này.

* Cài thư viện: `npm install`
* Chạy môi trường phát triển: `npm run dev`
* Biên dịch bản phát hành: `npm run build`
* Xem thử bản build: `npm run preview`
* Địa chỉ xem trang khi chạy dev: `http://localhost:3000`

---

## 3. Công nghệ đang dùng

> **PHẦN PHẢI ĐIỀN LẠI.** Không chắc thì nhờ AI: *"Đọc package.json và cho tôi biết dự án
> này dùng framework gì, ngôn ngữ gì, chạy bằng lệnh nào."*

* Framework: **Next.js 16 (App Router) & React 19**
* Ngôn ngữ: **TypeScript**
* CSS: **Tailwind CSS**
* Icon: **Lucide Icons**
* Hiệu ứng: **Framer Motion**

**Không tự ý cài thêm thư viện.** Cần thêm thì nói rõ tên thư viện, lý do cần,
và đợi tôi đồng ý rồi mới chạy `npm install`.

---

## 4. Cấu trúc thư mục

```
.
├── DESIGN.md          ← Design system: màu, font, spacing. ĐỌC TRƯỚC KHI SỬA GIAO DIỆN.
├── CLAUDE.md          ← Tệp này. Quy tắc dự án.
├── docs/
│   └── spec.md        ← Đặc tả: tính năng và luồng tương tác của khách mời.
└── src/               ← Mã nguồn.
```

Ba tệp tài liệu trên là **nguồn sự thật**. Khi tôi yêu cầu một việc mâu thuẫn với chúng,
hãy nói cho tôi biết chỗ mâu thuẫn thay vì lặng lẽ làm theo.

---

## 5. Quy tắc giao diện

Design system của dự án nằm ở tệp dưới đây, được nạp sẵn vào mọi phiên làm việc:

@DESIGN.md

**Luôn bám đúng token trong đó khi viết hoặc sửa bất kỳ đoạn giao diện nào.**

* Chỉ dùng các token màu đã khai báo trong `DESIGN.md`. Không tự chế mã màu mới.
* Chỉ dùng thang chữ và thang spacing trong `DESIGN.md`. Không tự đặt cỡ chữ lẻ.
* Chữ thường bắt buộc dùng `charcoal` hoặc `charcoal-muted`.
  **Không bao giờ dùng màu `gold` cho chữ thường** — độ tương phản chỉ 2.9:1, không đọc được.
* Mọi chữ hiển thị cho khách mời phải là **tiếng Việt có dấu**.
* Trước khi dùng một font mới, kiểm tra font đó có bộ dấu tiếng Việt chưa
  (cách kiểm tra nằm trong `DESIGN.md`).

---

## 6. Quy tắc lưu dữ liệu — theo từng giai đoạn

Dự án này đi qua nhiều giai đoạn. **Đừng nhảy cóc.**

| Giai đoạn | Cách lưu dữ liệu RSVP |
|---|---|
| Buổi 3 | Chỉ state trong bộ nhớ (`useState`). F5 mất dữ liệu là đúng, chưa cần sửa. |
| Buổi 4 | `LocalStorage` — F5 không mất. |
| Buổi 5 | Supabase (database đám mây). |

Hiện dự án đang ở giai đoạn: **Buổi 3**

Không tự ý nâng cấp lên giai đoạn sau khi tôi chưa yêu cầu.

---

## 7. Cách tôi muốn bạn làm việc

* **Lập kế hoạch trước khi sửa.** Trình bày bạn định sửa tệp nào, sửa gì, rồi đợi tôi
  đồng ý. Không vừa đọc yêu cầu vừa sửa file luôn.
* **Sửa tối thiểu.** Chỉ đụng vào đúng chỗ cần đổi. Không viết lại cả tệp khi chỉ cần
  sửa vài dòng. Không đổi format, không sắp xếp lại import của phần không liên quan.
* **Giữ nguyên comment và code sẵn có** không liên quan tới việc đang làm.
* **Đi từng bước nhỏ.** Làm xong một phần, để tôi chạy thử trên trình duyệt rồi mới
  làm phần tiếp theo. Đừng làm cả 4 section trong một lượt.
* **Component nhỏ, tách tệp rõ ràng.** Không dồn cả trang vào một tệp khổng lồ.
* **Trả lời bằng tiếng Việt**, tránh thuật ngữ. Thuật ngữ bắt buộc phải dùng thì
  giải nghĩa ngắn ngay lần đầu.
* **Sau khi sửa xong, nói tôi cần kiểm tra gì** trên trình duyệt để biết đã chạy đúng.

### Khi gặp lỗi

* Sửa một lỗi quá **3 lần** vẫn chưa xong thì **dừng lại**. Đừng prompt tiếp.
  Nói tôi biết bạn đang bí ở đâu, và đề xuất tôi Discard Changes trong tab Source Control
  để quay về bản chạy được gần nhất.
* Không "sửa" lỗi bằng cách xoá tính năng hay bọc `try/catch` rỗng cho hết báo lỗi.

---

## 8. Hình ảnh, nhạc và bản quyền

Trang này gửi cho khách mời thật, nên tài nguyên dùng trong đó phải hợp lệ.

* **Không nhúng nhạc tự động phát.** Trình duyệt chặn `audio.play()` khi trang vừa tải,
  và khách mời có thể đang ở nơi cần yên tĩnh. Nhạc chỉ phát sau khi khách chủ động bấm nút,
  và luôn phải có nút tắt nhìn thấy được (chuẩn WCAG 1.4.2). Lưu lựa chọn bật/tắt vào
  `localStorage` và tôn trọng nó ở lần truy cập sau.
* **Chỉ dùng nhạc có giấy phép cho phép.** Không lấy nhạc từ YouTube, không dùng nhạc pop
  hay nhạc phim. Lưu ý: tác phẩm cổ điển đã hết hạn bản quyền **không** đồng nghĩa bản thu âm
  của nó miễn phí — bản thu có bản quyền riêng.
* **Không tự ý tải ảnh hay nhạc từ nguồn không rõ giấy phép.** Cần tài nguyên mới thì
  đề xuất cho tôi nguồn kèm giấy phép, đợi tôi duyệt.
* Ảnh placeholder trong lúc phát triển thì dùng Unsplash. Trước khi đưa trang cho khách,
  thay bằng ảnh cưới thật của Nam & Lan.
* Mỗi tài nguyên bên ngoài đưa vào dự án phải được ghi lại **tên nguồn và giấy phép**
  trong `README.md` của dự án.

---

## 9. An toàn

* Không commit khoá API, mật khẩu, chuỗi kết nối database. Những thứ đó để trong `.env`,
  và `.env` phải nằm trong `.gitignore`.
* Không thêm mã theo dõi người dùng, không gắn quảng cáo.
* Số điện thoại khách mời nhập vào là **dữ liệu cá nhân**. Không gửi nó đi đâu ngoài
  nơi lưu trữ đã thống nhất ở mục 6.
