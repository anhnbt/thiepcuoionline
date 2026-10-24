/**
 * TIỆN ÍCH MỞ RỘNG — Cầu nối Webhook từ Supabase sang Google Sheets
 * Tệp: docs/integrations/apps-script-google-sheets.gs
 *
 * Dùng khi cần tự động đồng bộ: Mỗi khi có khách mời gửi RSVP mới trong Supabase,
 * dữ liệu tự động được ghi thêm một dòng vào Google Sheet đích theo thời gian thực.
 *
 * CÁCH TRIỂN KHAI
 * 1. Mở Google Sheet đích → Extensions → Apps Script.
 * 2. Dán toàn bộ file này vào, đổi TEN_SHEET cho khớp với tên Sheet bạn muốn ghi.
 * 3. Deploy → New deployment → chọn type "Web app":
 *      Execute as:        Me (Tôi)
 *      Who has access:    Anyone (Bất kỳ ai)
 *    Bấm Deploy, copy đường dẫn Web app URL được cấp.
 * 4. Sang Supabase Dashboard → Database → Webhooks → Create a new hook:
 *      Name:    gui_sang_google_sheet
 *      Table:   rsvp_guests
 *      Events:  Insert
 *      Type:    HTTP Request, method POST
 *      URL:     Dán đường dẫn Web app URL ở bước 3
 *
 * LƯU Ý BẢO MẬT
 * "Who has access: Anyone" nghĩa là ai biết URL cũng gửi được request.
 * Không chia sẻ URL công khai ra bên ngoài.
 */

const TEN_SHEET = 'Danh sách RSVP';

function doPost(e) {
  try {
    const goi = JSON.parse(e.postData.contents);

    // Supabase gửi bản ghi mới trong trường "record".
    const banGhi = goi.record || goi;

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TEN_SHEET)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(TEN_SHEET);

    // Lần đầu tiên: tự tạo hàng tiêu đề theo đúng các cột có trong bản ghi
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Nhận lúc', ...Object.keys(banGhi)]);
    }

    sheet.appendRow([new Date(), ...Object.values(banGhi)]);

    return ketQua({ ok: true });
  } catch (err) {
    // Lỗi vẫn trả về 200 kèm nội dung lỗi, để Supabase không gọi lại liên tục
    return ketQua({ ok: false, loi: String(err) });
  }
}

/** Mở URL bằng trình duyệt để kiểm tra đã deploy đúng chưa */
function doGet() {
  return ketQua({ ok: true, ghi_chu: 'Web app đang chạy. Dùng POST để gửi dữ liệu.' });
}

function ketQua(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
