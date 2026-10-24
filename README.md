# Bạch Đằng 938 – Trận địa cọc | Handoff MVP V2

Bộ asset bàn giao cho bản MVP V2 của game arcade lịch sử về bãi cọc Bạch Đằng năm 938. Bộ này tập trung vào ba hành động chính: quan sát thủy triều, ghi nhớ vị trí cọc và thả cọc đúng thời điểm.

## Thay đổi gameplay bắt buộc của V2

- Không hiển thị điểm số cho người chơi. Kết quả dùng số vòng đã vượt qua và trạng thái hoàn thành.
- Khi nước dâng, cọc cũ phải bị che hoàn toàn. Không để lộ đầu cọc, bóng hoặc đường viền.
- Cọc tiếp theo phải có vị trí bắt đầu, hướng và nhịp di chuyển được xáo trộn có kiểm soát.
- Số cọc đề xuất cho chế độ thử thách: `6 / 8 / 10 / 11 / 13`.
- Không tạo vị trí ngẫu nhiên bất khả thi. Dùng tập vị trí an toàn hoặc khoảng cách tối thiểu giữa các cọc.
- Chế độ trải nghiệm có thể dùng cấu hình cũ `5 / 6 / 7 / 8 / 10` để phục vụ khách chơi lần đầu.

Chi tiết luật mới nằm trong `DATA/gameplay_rules_v2.md` và cấu hình trong `DATA/round_config_v2.json`.

## Cách chạy demo hiện tại

`DEMO/index.html` là demo gameplay V2. Mở bằng Chrome hoặc Edge ở chế độ màn hình ngang. Nếu trình duyệt hạn chế asset qua `file://`, chạy HTTP server tại thư mục `BachDang938_Game_Assets` bằng `python -m http.server 8000`, sau đó mở `http://localhost:8000/DEMO/`.

Demo V2 đã tích hợp chế độ Trải nghiệm và Thử thách, bỏ điểm số, tăng số cọc ở chế độ Thử thách, random vị trí xuất hiện cọc tiếp theo, nước dâng che kín cọc cũ, nhân vật PNG hi-res, BGM prototype, trống phản công và hiệu ứng bọt nước. Đã kiểm tra cú pháp JavaScript bằng `node --check` và smoke test luồng bắt đầu/thả cọc trên HTTP server.

## Cấu trúc tài nguyên

- `BG/`: cảnh sông, bờ sông và lớp sóng.
- `CHR/`: Ngô Quyền với các tư thế chờ, ra hiệu và chiến thắng; có thêm bộ PNG độ phân giải cao và lớp áo choàng tùy chọn.
- `PROP/`: cọc, tàu Nam Hán và thuyền nghi binh.
- `UI/`, `ICO/`: giao diện và biểu tượng.
- `VFX/`: splash, impact, bọt nước nâng cao và asset hỗ trợ che nước/ăn mừng.
- `ANM/`: hợp đồng chuyển động để lập trình tween/canvas.
- `SFX/`, `BGM/`: âm thanh prototype tự tạo; `VO/battle_calls_script.json` là kịch bản chờ thu giọng.
- `FONT/`: Be Vietnam Pro và giấy phép OFL dùng cho tiếng Việt trong UI.
- `DATA/`: luật chơi, cấu hình vòng, văn bản giao diện và checklist nội dung.
- `REFERENCE/`: định hướng mỹ thuật. Không dùng concept nguyên ảnh làm sprite trong game.

## Asset cần IT/designer bổ sung

- Đã bổ sung nhân vật Ngô Quyền PNG độ phân giải cao, lớp áo choàng, hiệu ứng bọt nước, font tiếng Việt và nhạc/trống prototype.
- Còn cần thu âm hoặc tạo voice hợp lệ cho các câu hô chiến trận trong `VO/battle_calls_script.json`.
- Lớp nước dâng kín toàn bộ vùng cọc và hiệu ứng chiến thắng vòng đã có asset SVG trong pack.

Danh sách chi tiết và trạng thái nằm trong `asset_manifest.xlsx` và `DATA/asset_handoff_v2.json`.

## Lưu ý nội dung và bản quyền

Nhân vật, bối cảnh và hiệu ứng là minh họa cách điệu, không phải ảnh tư liệu lịch sử. Phần mô tả lịch sử cần được người phụ trách nội dung kiểm duyệt. Nhạc, voice và asset bổ sung chỉ được đưa vào bản chính thức sau khi xác nhận quyền sử dụng hoặc tự sản xuất.
