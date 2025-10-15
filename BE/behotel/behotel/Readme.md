Helper : tiện ích dùng chung toàn project vd:  chuyển đổi tiền số sang chữ
Model : là nơi ánh xạ toàn bộ db(trong db có bao nhiêu bảng -> model có bấy nhiêu class )
Interface : nơi khai báo all chức năng 
Implement : kế thừa các chức năng từ interface và triển khai
DTO : là nơi có thể tùy chỉnh các class theo ý của mình 
Security : chứa thông tin các dịch vụ xác thực của all project 
Controller : end point nơi cấu hình các api 
Query : ko viết đc linq sd query native xuống db
Core : lưu thông tin khóa bí mật của project 


//  mẫu connection string
"ConnectionStrings": {
    "DBConnection": "data source=DESKTOP-OCE20UL;initial catalog=Syllabus;persist security info=True;user id=sa;password=123456;MultipleActiveResultSets=True;encrypt=false"
  }