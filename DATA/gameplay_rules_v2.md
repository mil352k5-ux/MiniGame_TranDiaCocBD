# Gameplay Rules V2

## Mục tiêu người chơi

Người chơi phải quan sát vị trí các cọc khi nước rút, ghi nhớ vị trí khi nước dâng và thả các cọc đang di chuyển sao cho không cắm trùng.

## Luật chính

1. Một lượt gồm tối đa 5 vòng.
2. Mỗi vòng có số cọc tăng dần.
3. Nước rút cho phép nhìn thấy cọc đã cắm.
4. Nước dâng che hoàn toàn cọc đã cắm.
5. Cọc đang di chuyển vẫn luôn nhìn thấy.
6. Cọc mới có vị trí bắt đầu và hướng di chuyển được xáo trộn có kiểm soát.
7. Cắm trùng hoặc hết giờ khi chưa đủ cọc sẽ kết thúc lượt.
8. Không hiển thị điểm số trong trải nghiệm người chơi.
9. Vượt vòng 3 có thể là mốc nhận quà trải nghiệm.
10. Vượt vòng 5 là trạng thái đại thắng.

## Cấu hình đề xuất

| Chế độ | Vòng 1 | Vòng 2 | Vòng 3 | Vòng 4 | Vòng 5 |
|---|---:|---:|---:|---:|---:|
| Trải nghiệm | 5 | 6 | 7 | 8 | 10 |
| Thử thách | 6 | 8 | 10 | 11 | 13 |

## Yêu cầu random cọc

- Không spawn cọc mới ngay tại vị trí cọc vừa đặt.
- Không tạo khoảng cách nhỏ hơn ngưỡng va chạm.
- Không tạo chuỗi vị trí khiến người chơi không thể hoàn thành trong thời gian vòng.
- Có thể dùng shuffle bag gồm các vị trí an toàn thay vì random thuần túy.
- Mỗi lần chơi nên dùng seed khác nhau để tăng khả năng chơi lại.

## Yêu cầu thủy triều

- Lớp nước dâng phải che toàn bộ thân và đầu cọc cũ.
- Không vẽ marker, bóng hoặc viền vị trí cọc trong giai đoạn nước dâng.
- Có cảnh báo âm thanh trước khi nước dâng và nước rút.
- Khi nước rút, cọc hiện lại nhanh để người chơi xác nhận trí nhớ.

## Kết quả

- Thất bại: hiển thị vòng thất bại và số cọc đã đặt.
- Vượt vòng: hiển thị vòng tiếp theo.
- Hoàn thành: hiển thị đại thắng và tổng số vòng vượt qua.
