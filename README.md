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

`DEMO/index.html` vẫn là demo tham chiếu V1. Mở bằng Chrome hoặc Edge ở chế độ màn hình ngang. Nếu trình duyệt hạn chế asset qua `file://`, chạy HTTP server tại thư mục `BachDang938_Game_Assets` bằng `python -m http.server 8000`, sau đó mở `http://localhost:8000/DEMO/`.

Demo đã kiểm tra cú pháp JavaScript bằng `node --check`. Bản V2 cần được IT cập nhật gameplay theo tài liệu bàn giao trước khi nghiệm thu chính thức.

## Cấu trúc tài nguyên

- `BG/`: cảnh sông, bờ sông và lớp sóng.
- `CHR/`: Ngô Quyền với các tư thế chờ, ra hiệu và chiến thắng.
- `PROP/`: cọc, tàu Nam Hán và thuyền nghi binh.
- `UI/`, `ICO/`: giao diện và biểu tượng.
- `VFX/`: splash, impact và asset hỗ trợ che nước/ăn mừng.
- `ANM/`: hợp đồng chuyển động để lập trình tween/canvas.
- `SFX/`, `BGM/`: âm thanh prototype và yêu cầu âm thanh cần sản xuất.
- `DATA/`: luật chơi, cấu hình vòng, văn bản giao diện và checklist nội dung.
- `REFERENCE/`: định hướng mỹ thuật. Không dùng concept nguyên ảnh làm sprite trong game.

## Asset cần IT/designer bổ sung

- Nhân vật Ngô Quyền độ phân giải cao, hỗ trợ tiếng Việt đầy đủ trong UI.
- Nhạc nền sảnh và nhạc nền gameplay riêng.
- Tiếng trống, tiếng hò reo và lời hô chiến trận ở phân đoạn phản công.
- Lớp nước dâng kín toàn bộ vùng cọc.
- Hiệu ứng chiến thắng vòng và phản công rõ hơn.

Danh sách chi tiết và trạng thái nằm trong `asset_manifest.xlsx` và `DATA/asset_handoff_v2.json`.

## Lưu ý nội dung và bản quyền

Nhân vật, bối cảnh và hiệu ứng là minh họa cách điệu, không phải ảnh tư liệu lịch sử. Phần mô tả lịch sử cần được người phụ trách nội dung kiểm duyệt. Nhạc, voice và asset bổ sung chỉ được đưa vào bản chính thức sau khi xác nhận quyền sử dụng hoặc tự sản xuất.
