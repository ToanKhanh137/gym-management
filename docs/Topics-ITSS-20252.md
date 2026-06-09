DANH SÁCH CHỦ ĐỀ MINI PROJECT
HỌC KỲ 20252

Chủ đề 01. Hệ thống Quản lý Nhóm Thực hiện Dự án hoặc Bài tập lớn trong Môn học

1. Mô tả

Nhiều sinh viên phải giải quyết các bài tập lớn hoặc dự án thực hiện theo nhóm trong quá trình
học tập. Tuy nhiên, thực tế cho thấy sự chênh lệch trong mức độ đóng góp giữa các thành viên có thể

ảnh hưởng đến hiệu quả làm việc nhóm. Và những trải nghiệm học tập có thể trở nên kém hấp dẫn
hơn do có sự xuất hiện của "những thành viên tự do", tức là những thành viên cố gắng giảm thiểu nỗ

lực của mình bằng cách dựa vào công việc của người khác.

Đối với người hướng dẫn, việc đánh giá sự đóng góp của từng thành viên trong nhóm là một

công việc tốn nhiều thời gian và dễ mắc sai sót. Do nhiều dự án phát triển phần mềm dựa vào việc sử
dụng các công cụ kiểm soát phiên bản (ví dụ nền tảng Git) nên việc phân tích nhật ký của các công cụ

này là một cách phổ biến để phân tích hoạt động của những người đóng góp. Tuy nhiên, việc sử dụng
số lần commits và/hoặc số dòng mã (LOC) có thể chưa cung cấp đầy đủ cho việc đánh giá.

Do đó, hệ thống quản lý nhóm thực hiện dự án được đề xuất nhằm hỗ trợ việc tổ chức, theo
dõi và đánh giá hiệu quả làm việc nhóm một cách minh bạch và chính xác. Hệ thống quản lý nhóm

thực hiện dự án không chỉ giúp nâng cao hiệu suất làm việc nhóm mà còn hỗ trợ giảng viên trong việc
đánh giá công bằng sự đóng góp của từng thành viên. Bằng cách tích hợp các công cụ theo dõi hoạt

động, phân tích dữ liệu, và hỗ trợ đánh giá định lượng, hệ thống này giúp tạo ra một môi trường học
tập minh bạch và hiệu quả hơn.

2. Các đối tượng sử dụng hệ thống

•  Sinh viên: Tham gia vào các nhóm dự án, thực hiện công việc theo phân công, cập nhật tiến

độ và ghi nhận đóng góp.

•  Nhóm trưởng: Điều phối công việc trong nhóm, phân chia nhiệm vụ, theo dõi tiến độ của các

thành viên, và báo cáo tình hình thực hiện.

•  Người hướng dẫn (giảng viên, trợ giảng): Tạo lập dự án, theo dõi hoạt động của các nhóm,

đánh giá mức độ tham gia của từng thành viên, và đưa ra phản hồi.

•  Quản trị viên hệ thống: Quản lý tài khoản người dùng, bảo trì hệ thống, hỗ trợ xử lý các sự cố

kỹ thuật.

3. Một số chức năng chính

(sinh viên có thể khảo sát thêm các hệ thống hoặc sản phẩm tương tự nhằm đề xuất thêm các chức
năng bổ sung nếu có)

a. Quản lý nhóm dự án

•  Sinh viên có thể đăng ký nhóm hoặc hệ thống tự động gán nhóm dựa trên tiêu chí do người

hướng dẫn thiết lập.

•  Nhóm trưởng có thể phân công công việc, cập nhật trạng thái của từng nhiệm vụ.

•  Các thành viên có thể báo cáo tiến độ công việc, đề xuất thay đổi, và trao đổi qua diễn đàn hoặc

công cụ chat nội bộ.

b. Theo dõi và ghi nhận đóng góp của từng thành viên

•  Hệ thống tích hợp với các nền tảng quản lý mã nguồn như Git để theo dõi lịch sử làm việc,

commits, số dòng mã (LOC), số lần đóng góp,… vào tài liệu dự án.

•  Ghi nhận thời gian làm việc thông qua công cụ theo dõi hoạt động như nhật ký công việc, bảng

công việc (Kanban, Scrum).

•  Đánh giá chất lượng đóng góp dựa trên các tiêu chí như số lượng task hoàn thành, mức độ

phức tạp của nhiệm vụ.

c. Hệ thống đánh giá công bằng

•  Cung cấp chức năng đánh giá chéo giữa các thành viên trong nhóm để phản ánh mức độ hợp

tác.

•  Giảng viên có thể xem báo cáo chi tiết về từng thành viên, bao gồm số lượng commits, tần suất

làm việc, và phản hồi từ đồng đội.

•  Tích hợp phân tích dữ liệu để phát hiện các thành viên có mức đóng góp không cân đối.

4. Một số quy trình nghiệp vụ
a. Tạo lập và quản lý dự án

•  Người hướng dẫn khởi tạo một dự án mới, xác định số lượng thành viên trong mỗi nhóm, và

đặt tiêu chí đánh giá.

•  Nhóm trưởng phân chia công việc và đặt ra các deadlines cụ thể cho từng nhiệm vụ.
•  Các thành viên truy cập vào hệ thống để nhận nhiệm vụ, cập nhật trạng thái, và tải lên tài liệu

liên quan.

b. Giám sát tiến độ và đánh giá đóng góp

•  Hệ thống theo dõi lịch sử làm việc của mỗi thành viên dựa trên dữ liệu từ Git, bảng công việc,

hoặc các công cụ hỗ trợ.

•  Người hướng dẫn có thể xem biểu đồ hoạt động của từng nhóm và từng cá nhân để đưa ra

đánh giá ban đầu.

•  Thành viên trong nhóm có thể phản hồi về quá trình làm việc của nhau để hỗ trợ đánh giá công

bằng.

c. Phát hiện và xử lý thành viên "tự do"

•  Hệ thống tự động xác định các sinh viên có mức độ đóng góp thấp dựa trên lịch sử làm việc.

•  Nhóm trưởng hoặc giảng viên có thể yêu cầu giải trình hoặc điều chỉnh vai trò của thành viên

đó trong nhóm.

•  Hệ thống gợi ý hình thức đánh giá bổ sung (ví dụ: phỏng vấn cá nhân, kiểm tra kiến thức) để

đảm bảo sự công bằng.

…/…

Chủ đề 02. Hệ thống quản lý phòng tập Gym

1. Mô tả

Hệ thống quản lý phòng tập gym được thiết kế nhằm hỗ trợ chủ phòng tập và nhân viên trong việc
quản lý hiệu quả các hoạt động vận hành, bao gồm quản lý phòng tập, thiết bị, nhân sự, hội viên và

gói tập. Bằng cách cung cấp một nền tảng kỹ thuật số tích hợp, hệ thống giúp tối ưu hóa quy trình
quản lý, giảm thiểu sai sót và nâng cao trải nghiệm của hội viên.

2. Đối tượng sử dụng hệ thống

•  Chủ phòng tập: Quản lý tổng thể hoạt động kinh doanh của phòng gym, bao gồm doanh thu,

nhân sự, hội viên, thiết bị và phản hồi khách hàng.

•  Nhân viên quản lý: Hỗ trợ chủ phòng tập trong việc theo dõi hoạt động hàng ngày, kiểm soát

đăng ký, gia hạn gói tập và xử lý phản hồi từ hội viên.

•  Huấn luyện viên cá nhân: Quản lý danh sách học viên, theo dõi lịch tập, hướng dẫn và đánh

giá tiến độ tập luyện.

•  Hội viên: Đăng ký, theo dõi gói tập, quản lý lịch sử tập luyện và đánh giá chất lượng dịch vụ.

3. Một số chức năng chính
(sinh viên có thể khảo sát thêm các hệ thống hoặc sản phẩm tương tự nhằm đề xuất thêm các chức
năng bổ sung nếu có)
3.1 Quản lý phòng tập

•  Quản lý thông tin phòng tập: Lưu trữ và cập nhật thông tin về các phòng tập (mã phòng, tên

phòng, loại phòng: gym, yoga, fitness, v.v.), số lượng phòng và tình trạng hoạt động.

•  Quản lý thiết bị tập luyện: Theo dõi danh sách thiết bị trong phòng tập (mã thiết bị, tên thiết

bị, số lượng, ngày nhập về, bảo hành, xuất xứ, trạng thái sử dụng).

•  Quản lý nhân sự: Phân quyền cho các nhóm nhân sự (nhân viên kinh doanh, nhân viên chăm

sóc khách hàng, huấn luyện viên cá nhân), theo dõi lịch làm việc và đánh giá hiệu suất.

•  Quản lý phản hồi hội viên: Tiếp nhận và xử lý đánh giá, phản hồi về nhân viên và cơ sở vật

chất của phòng tập.

3.2 Quản lý hội viên

•  Lưu trữ thông tin cá nhân: Ghi nhận họ tên, tuổi, nghề nghiệp, thông tin liên hệ, sinh nhật,

loại thành viên và dấu vân tay (nếu có).

•  Quản lý đăng ký và gia hạn: Theo dõi ngày đăng ký, loại đăng ký (theo buổi, theo tháng, theo

năm), tình trạng gia hạn.

•  Lịch sử sử dụng dịch vụ: Ghi nhận số buổi tập, thời gian tập, các dịch vụ đã sử dụng và mức

độ tham gia.

•  Tài khoản hội viên: Hội viên có thể đăng nhập hệ thống để theo dõi gói tập, lịch tập, phản hồi

và nhận thông tin khuyến mãi.

3.3 Quản lý gói tập

•  Thiết lập gói tập: Định nghĩa các loại gói tập (gói 3 tháng, 6 tháng, 1 năm, gói theo buổi, gói

VIP, gói tập cá nhân với huấn luyện viên).

•  Quản lý đăng ký và thanh toán: Xác nhận đăng ký gói tập, ghi nhận thanh toán, cấp biên lai

và gia hạn gói tập khi cần thiết.

3.4 Báo cáo thống kê

•  Doanh thu: Thống kê doanh thu theo ngày, tuần, tháng, quý, năm.
•  Đăng ký mới và gia hạn: Báo cáo số lượng hội viên mới, hội viên gia hạn, số buổi tập đã sử

dụng.

•  Hiệu suất nhân viên: Đánh giá mức độ làm việc của nhân viên dựa trên phản hồi hội viên và

hoạt động quản lý.

4. Một số quy trình nghiệp vụ
4.1 Quy trình đăng ký hội viên mới

1.  Hội viên cung cấp thông tin cá nhân và chọn gói tập.
2.  Nhân viên tiếp nhận, tạo hồ sơ hội viên trên hệ thống.

3.  Hội viên thanh toán gói tập (tiền mặt, thẻ ngân hàng, ví điện tử).
4.  Hệ thống cấp mã hội viên và cập nhật vào danh sách hội viên.

4.2 Quy trình ghi nhận lịch sử tập luyện và theo dõi gói tập

1.  Hội viên đăng nhập vào hệ thống qua ứng dụng hoặc website.

2.  Hệ thống hiển thị thông tin gói tập, lịch sử sử dụng, số buổi còn lại.
3.  Nhân viên quản lý hoặc huấn luyện viên cá nhân ghi nhận lịch sử tập luyện của hội viên

4.  Hội viên có thể gia hạn gói tập trực tuyến.

4.3 Quy trình bảo trì thiết bị

1.  Nhân viên kiểm tra tình trạng thiết bị định kỳ.
2.  Nếu phát hiện lỗi, nhân viên báo cáo trên hệ thống.

3.  Hệ thống thông báo cho bộ phận bảo trì để xử lý.
4.  Sau khi sửa chữa, trạng thái thiết bị được cập nhật lại.

…/…

Chủ đề 03. Hệ thống hỗ trợ sự cố xe trên đường

1. Mô tả

Cứu hộ giao thông là dịch vụ thông dụng trở nên cần thiết và cấp bách. Đây cũng là dịch vụ
được nhiều người lựa chọn khi xe gặp sự cố hư hỏng. Nếu không may phương tiện giao thông của

bạn gặp phải trục trặc khi đang trên đường di chuyển như: Lốp xe bị thủng, xì hơi, nổ lốp cần thay thế
mới hay vá lốp bơm hơi hay thay thế lốp dự phòng; Bình ắc quy của xe có dấu hiệu bị yếu dần đi hoặc

hết điện đột ngột khi đang di chuyển khiến cho xe không thể nổ và khởi động được; Xe chết máy bất
chợt hoặc hư hỏng không rõ nguyên nhân; Tai nạn gặp phải không mong muốn xảy ra; Hoặc chẳng

may vì một lý do nào đó mà xe dừng lại do thiếu xăng, chủ xe sẽ rất khó đẩy xe đến cây xăng gần
nhất…. Các tình huống phức tạp cần đến sự hỗ trợ của các dịch vụ cứu hộ giao thông chuyên nghiệp

nhưng cũng có tình huống đơn giản có thể được hướng dẫn hoặc trợ giúp của những người tham gia
giao thông khác.

Hệ thống hỗ trợ sự cố xe trên đường là một nền tảng số giúp kết nối người tham gia giao thông
gặp sự cố với các đơn vị cung cấp dịch vụ cứu hộ giao thông chuyên nghiệp. Hệ thống được thiết kế

để tối ưu hóa quy trình tiếp nhận, xử lý và giải quyết các sự cố xe cộ theo thời gian thực, giúp nâng
cao hiệu quả cứu hộ và cải thiện trải nghiệm người dùng.

2. Đối tượng sử dụng

•  Người dùng cá nhân: Những người tham gia giao thông gặp sự cố xe và cần hỗ trợ từ hệ

thống.

•  Các công ty cung cấp dịch vụ cứu hộ: Các đơn vị kinh doanh dịch vụ cứu hộ, sửa chữa và

hỗ trợ xe gặp sự cố.

•  Quản trị viên hệ thống: Người chịu trách nhiệm quản lý tài khoản, đảm bảo tính chính xác và

bảo mật thông tin trên nền tảng.

3. Một số chức năng chính của
(sinh viên có thể khảo sát thêm các hệ thống hoặc sản phẩm tương tự nhằm đề xuất thêm các chức
năng bổ sung nếu có)
3.1. Quản lý thông tin cứu hộ

•  Quản lý công ty cứu hộ: Lưu trữ và cập nhật thông tin về các công ty cung cấp dịch vụ cứu

hộ, bao gồm tên, địa chỉ, số điện thoại liên hệ, phạm vi hoạt động và giấy phép hoạt động.
•  Quản lý dịch vụ cứu hộ: Danh mục các dịch vụ hỗ trợ như vá lốp, thay lốp, nạp nhiên liệu, kéo

xe, sửa chữa tại chỗ và chi phí cho từng dịch vụ.

•  Quản lý phương tiện cứu hộ: Ghi nhận các loại xe cứu hộ và thiết bị hỗ trợ đi kèm.
•  Quy trình cứu hộ: Mô tả chi tiết từng bước xử lý khi nhận được yêu cầu cứu hộ, từ tiếp nhận

thông tin đến triển khai hỗ trợ.

3.2. Quản lý yêu cầu cứu hộ

•  Gửi yêu cầu cứu hộ: Người dùng có thể tạo yêu cầu cứu hộ bằng cách nhập thông tin về sự

cố, vị trí hiện tại, mô tả tình trạng xe và lựa chọn loại dịch vụ cần hỗ trợ.

•  Tìm kiếm dịch vụ cứu hộ gần nhất: Hệ thống cung cấp danh sách các công ty cứu hộ theo vị

trí, kèm theo đánh giá của người dùng trước đó.

•  Xác nhận và theo dõi yêu cầu cứu hộ: Người dùng có thể theo dõi trạng thái yêu cầu cứu hộ

theo thời gian thực và nhận thông báo khi có phản hồi từ công ty cứu hộ.

•  Hủy yêu cầu cứu hộ: Nếu người dùng tự khắc phục được sự cố hoặc tìm được phương án

khác, họ có thể hủy yêu cầu trước khi công ty cứu hộ tiếp nhận.

3.3. Tương tác giữa các bên

•  Hệ thống nhắn tin: Cung cấp chức năng trò chuyện giữa người gặp sự cố và đơn vị cứu hộ

để làm rõ thông tin và thỏa thuận chi phí.

•  Hệ thống phản hồi và đánh giá: Sau khi dịch vụ hoàn tất, người dùng có thể đánh giá chất

lượng dịch vụ và phản hồi để giúp cải thiện trải nghiệm hệ thống.

•  Hỗ trợ tư vấn từ cộng đồng: Trong các sự cố đơn giản, người dùng có thể nhận hướng dẫn

từ những người tham gia giao thông khác.

3.4. Quản trị hệ thống

•  Quản lý tài khoản người dùng: Duy trì thông tin người dùng, xác thực danh tính và hỗ trợ các

vấn đề liên quan đến đăng nhập, bảo mật.

•  Quản lý tài khoản công ty cứu hộ: Xác minh danh tính các đơn vị cứu hộ, kiểm tra tính hợp

lệ của giấy phép kinh doanh.

•  Kiểm duyệt nội dung: Đảm bảo các thông tin đăng tải trên hệ thống (bao gồm đánh giá, phản

hồi) không vi phạm quy định.

•  Báo cáo và thống kê: Cung cấp các báo cáo về số lượng yêu cầu cứu hộ, tần suất sử dụng

dịch vụ, tỷ lệ phản hồi, mức độ hài lòng của khách hàng.

4. Một số quy trình nghiệp vụ

4.1. Quy trình gửi yêu cầu cứu hộ

1.  Người dùng đăng nhập vào hệ thống.
2.  Chọn danh mục dịch vụ cứu hộ phù hợp với tình trạng xe.
3.  Nhập thông tin về sự cố, vị trí GPS, hình ảnh mô tả (nếu có).

4.  Hệ thống gợi ý danh sách đơn vị cứu hộ gần nhất kèm theo giá dịch vụ.
5.  Người dùng chọn đơn vị cứu hộ và gửi yêu cầu.

6.  Công ty cứu hộ tiếp nhận yêu cầu và phản hồi thời gian đến dự kiến.
7.  Người dùng theo dõi trạng thái yêu cầu và cập nhật khi cần.
8.  Sau khi hoàn tất cứu hộ, người dùng xác nhận dịch vụ và đánh giá chất lượng.

4.2. Quy trình tiếp nhận và xử lý yêu cầu của công ty cứu hộ

1.  Nhận thông báo về yêu cầu cứu hộ.

2.  Kiểm tra thông tin sự cố và xác định phương tiện cứu hộ phù hợp.

3.  Phản hồi thời gian dự kiến đến hiện trường.
4.  Điều phối nhân viên cứu hộ đến hỗ trợ khách hàng.

5.  Cập nhật tình trạng xử lý lên hệ thống.
6.  Hoàn tất dịch vụ và ghi nhận thông tin thanh toán.

7.  Xác nhận hoàn thành và nhận phản hồi từ khách hàng.

…/…

Chủ đề 04. Hệ thống đi chợ tiện lợi

1. Mô tả

Hệ thống đi chợ tiện lợi được thiết kế nhằm hỗ trợ người dùng trong việc lập kế hoạch mua
sắm, quản lý thực phẩm trong tủ lạnh và lên thực đơn hàng ngày. Mục tiêu của hệ thống là giúp người

dùng duy trì thói quen tiêu dùng hiệu quả, giảm thiểu lãng phí thực phẩm và đảm bảo dinh dưỡng hợp
lý.

Hệ thống cung cấp các công cụ quản lý danh sách mua sắm, theo dõi hạn sử dụng thực phẩm,
đề xuất món ăn từ nguyên liệu sẵn có, cũng như hỗ trợ xây dựng kế hoạch bữa ăn theo tuần. Ngoài

ra, hệ thống cho phép các thành viên trong gia đình chia sẻ thông tin mua sắm và phân công nhiệm
vụ, giúp tối ưu hóa quá trình đi chợ và sử dụng thực phẩm.

2. Đối tượng sử dụng hệ thống

Hệ thống được thiết kế để phục vụ nhiều nhóm đối tượng khác nhau, bao gồm:

•  Người nội trợ: Lên danh sách mua sắm, quản lý thực phẩm và tìm kiếm công thức nấu ăn.

•  Thành viên Gia đình: Cho phép các thành viên trong gia đình tạo nhóm và chia sẻ danh sách

mua sắm.

•  Hệ thống bao gồm một tài khoản quản trị viên:

o  Quản lý tài khoản người dùng, bao gồm tạo, chỉnh sửa và xóa tài khoản.

o  Quản lý danh mục dữ liệu như loại thực phẩm, đơn vị tính, công thức nấu ăn.
o  Kiểm soát các nội dung do người dùng nhập liệu để đảm bảo tính chính xác và hợp lệ.

o  Theo dõi và tối ưu hiệu suất hệ thống.

3. Một số chức năng chính
(sinh viên có thể khảo sát thêm các hệ thống hoặc sản phẩm tương tự nhằm đề xuất thêm các chức
năng bổ sung nếu có)
3.1 Quản lý danh sách mua sắm

•  Cho phép người dùng tạo danh sách mua sắm theo ngày hoặc tuần.
•  Hỗ trợ phân loại danh sách theo danh mục thực phẩm như rau củ, thịt cá, đồ khô, gia vị, v.v.

•  Cung cấp tính năng chia sẻ danh sách giữa các thành viên trong nhóm gia đình.
•  Cập nhật trạng thái mua sắm theo thời gian thực khi các thành viên hoàn tất việc mua hàng.

3.2 Quản lý thực phẩm trong tủ lạnh

•  Nhập thông tin thực phẩm bao gồm tên, số lượng, ngày hết hạn và vị trí lưu trữ.
•  Hệ thống gửi thông báo nhắc nhở khi thực phẩm sắp hết hạn (trước 3 ngày).

•  Phân loại thực phẩm theo nhóm và đề xuất cách bảo quản tối ưu.
•  Cho phép tìm kiếm thực phẩm theo tên hoặc danh mục.

3.3 Lên kế hoạch bữa ăn

•  Hỗ trợ tạo thực đơn theo ngày hoặc tuần.

•  Đề xuất bữa ăn dựa trên thực phẩm hiện có trong tủ lạnh.
•  Cung cấp công thức nấu ăn kèm hướng dẫn chế biến.

•  Hỗ trợ lưu trữ công thức yêu thích và đánh dấu món ăn phổ biến.

3.4 Gợi ý món ăn thông minh

•  Gợi ý món ăn dựa trên thực phẩm còn lại trong tủ lạnh.
•  Cung cấp danh sách nguyên liệu cần bổ sung nếu người dùng muốn thực hiện một công thức

nấu ăn cụ thể.

•  Hỗ trợ tìm kiếm món ăn theo nguyên liệu sẵn có.

3.5 Báo cáo và thống kê

•  Thống kê thực phẩm đã mua theo thời gian.

•  Phân tích xu hướng tiêu thụ thực phẩm trong gia đình.
•  Báo cáo số lượng thực phẩm bị lãng phí do hết hạn.

4. Một số quy trình nghiệp vụ

4.1 Quy trình quản lý danh sách mua sắm

1.  Người dùng tạo danh sách thực phẩm cần mua theo ngày hoặc tuần.

2.  Danh sách được chia sẻ với các thành viên trong nhóm gia đình (nếu có).
3.  Khi mua hàng, người dùng cập nhật trạng thái từng mặt hàng trong danh sách.

4.  Sau khi mua xong, hệ thống tự động cập nhật thực phẩm vào kho lưu trữ tủ lạnh.

4.2 Quy trình quản lý thực phẩm trong tủ lạnh

1.  Người dùng nhập thực phẩm mới vào hệ thống sau khi mua.
2.  Hệ thống theo dõi thời gian sử dụng và nhắc nhở khi thực phẩm sắp hết hạn.

3.  Khi chế biến món ăn, người dùng cập nhật số lượng thực phẩm đã sử dụng.
4.  Hệ thống tự động điều chỉnh tồn kho thực phẩm sau mỗi lần sử dụng.

4.3 Quy trình gợi ý món ăn

1.  Người dùng truy cập tính năng gợi ý món ăn.

2.  Hệ thống kiểm tra thực phẩm hiện có trong tủ lạnh.
3.  Hệ thống đề xuất các món ăn phù hợp và hiển thị công thức nấu ăn.
4.  Người dùng có thể chọn món ăn và cập nhật số lượng thực phẩm đã sử dụng.

4.4 Quy trình lên kế hoạch bữa ăn

1.  Người dùng chọn chế độ lên kế hoạch theo ngày hoặc tuần.
2.  Hệ thống đề xuất thực đơn dựa trên thực phẩm sẵn có.

3.  Người dùng xác nhận hoặc tùy chỉnh thực đơn theo sở thích.
4.  Hệ thống tự động tạo danh sách mua sắm nếu có nguyên liệu thiếu hụt.

…/…

Chủ đề 05. Hệ thống quản lý trung tâm chăm sóc thú cưng

1. Mô tả

Giữa lòng xã hội bận rộn, tấp nập như hiện nay thì chúng ta rất dễ rơi vào cảm giác trống rỗng,
chính vì thế mà ngày càng có nhiều người chọn nuôi thú cưng để giải tỏa cảm giác căng thẳng, mệt

mỏi và cô đơn. Thú cưng đang dần trở thành người bạn thân thiết của những ai yêu thích động vật,
họ có thể tâm sự với thú cưng rất nhiều chuyện xung quanh cuộc sống và dành cho thú cưng cái tên

gọi xưng hô thân mật như những thành viên trong gia đình.

Để hỗ trợ chủ nuôi trong việc theo dõi sức khỏe, sử dụng dịch vụ chăm sóc và quản lý thú cưng

một cách hiệu quả, hệ thống quản lý trung tâm chăm sóc thú cưng được phát triển. Hệ thống đóng vai
trò là cầu nối giữa trung tâm chăm sóc thú cưng, các bác sĩ thú y và chủ nuôi, cung cấp đầy đủ các

thông tin cần thiết về thú cưng cũng như các dịch vụ chăm sóc.

Hệ thống cho phép các trung tâm chăm sóc thú cưng quản lý thông tin về từng thú cưng được

đăng ký, cung cấp dịch vụ khám chữa bệnh, làm đẹp, lưu trú và các dịch vụ liên quan khác. Chủ nuôi
có thể dễ dàng theo dõi tình trạng sức khỏe, đặt lịch hẹn với bác sĩ thú y, sử dụng các dịch vụ và nhận

thông báo nhắc nhở về lịch tái khám hoặc các nhu cầu chăm sóc đặc biệt của thú cưng.

2. Đối tượng sử dụng hệ thống
Hệ thống được xây dựng để phục vụ các nhóm đối tượng sau:

•  Chủ nuôi thú cưng: Đăng ký thông tin thú cưng, đặt lịch khám, sử dụng các dịch vụ chăm sóc

và theo dõi sức khỏe thú cưng.

•  Nhân viên trung tâm chăm sóc thú cưng: Quản lý lịch hẹn, hồ sơ thú cưng, cung cấp dịch vụ

chăm sóc, làm đẹp và lưu trú.

•  Bác sĩ thú y: Chẩn đoán, kê đơn thuốc, cập nhật tình trạng sức khỏe thú cưng và lưu trữ hồ

sơ bệnh án.

•  Quản trị viên hệ thống: Quản lý tài khoản, theo dõi hoạt động của trung tâm, thống kê dữ liệu

và tối ưu hệ thống.

3. Một số chức năng chính
(sinh viên có thể khảo sát thêm các hệ thống hoặc sản phẩm tương tự nhằm đề xuất thêm các chức
năng bổ sung nếu có)
3.1. Quản lý thông tin thú cưng
Mỗi thú cưng được chủ nuôi đăng ký trên hệ thống sẽ có hồ sơ riêng bao gồm:

•  Thông tin cơ bản: Tên, tuổi, giới tính, giống loài, màu lông, hình ảnh nhận diện.

•  Tình trạng sức khỏe: Tiền sử bệnh án, lịch sử tiêm chủng, các dị ứng hoặc bệnh mãn tính.
•  Chế độ dinh dưỡng: Loại thức ăn phù hợp, khẩu phần ăn và các lưu ý đặc biệt.
•  Lịch sử dịch vụ: Tóm tắt các lần khám bệnh, làm đẹp, trông giữ.

Hệ thống giúp bác sĩ và nhân viên trung tâm truy cập nhanh chóng vào thông tin thú cưng mà không
cần chủ nuôi mang theo giấy tờ.

3.2. Quản lý khám chữa bệnh thú cưng
Hệ thống hỗ trợ quy trình khám chữa bệnh từ lúc đăng ký đến khi hoàn tất điều trị:

1.  Đăng ký khám bệnh: Chủ nuôi có thể đặt lịch khám qua hệ thống.
2.  Chuẩn đoán và xét nghiệm: Bác sĩ cập nhật kết quả khám, xét nghiệm lên hệ thống.

3.  Kê đơn thuốc: Lưu trữ đơn thuốc và hướng dẫn sử dụng cho chủ nuôi.
4.  Tái khám: Hệ thống tự động nhắc lịch tái khám nếu có chỉ định từ bác sĩ.

5.  Cảnh báo sức khỏe: Hệ thống gửi thông báo nếu phát hiện các triệu chứng bất thường.

3.3. Quản lý dịch vụ làm đẹp và vệ sinh thú cưng

Trung tâm cung cấp các dịch vụ như tắm gội, cắt tỉa lông, chăm sóc móng, massage, spa thú cưng.

•  Đăng ký dịch vụ: Chủ nuôi có thể đặt lịch trước hoặc sử dụng dịch vụ trực tiếp.

•  Theo dõi quy trình thực hiện: Nhân viên cập nhật tình trạng dịch vụ trên hệ thống.
•  Lịch sử dịch vụ: Lưu trữ thông tin để tư vấn cho chủ nuôi về các dịch vụ tiếp theo.

3.4. Quản lý dịch vụ lưu trú (khách sạn thú cưng)
Hệ thống hỗ trợ đặt phòng cho thú cưng khi chủ nuôi có nhu cầu gửi thú cưng trong thời gian ngắn

hoặc dài hạn.

•  Quản lý đặt phòng: Kiểm tra phòng trống, xác nhận đặt chỗ.

•  Quản lý lưu trú: Theo dõi tình trạng của thú cưng trong suốt thời gian lưu trú.
•  Chế độ ăn uống và chăm sóc đặc biệt: Nhập thông tin yêu cầu từ chủ nuôi.

•  Thông báo và cập nhật: Gửi hình ảnh và tình trạng thú cưng để chủ nuôi theo dõi từ xa.

3.5. Hệ thống nhắc nhở và thông báo

Hệ thống sẽ gửi thông báo đến chủ nuôi và nhân viên trung tâm khi có sự kiện quan trọng như:

•  Nhắc lịch tái khám, tiêm chủng, cắt tỉa lông định kỳ.

•  Cảnh báo về tình trạng sức khỏe của thú cưng.
•  Nhắc nhở về lịch đón thú cưng sau khi lưu trú.

3.6. Quản lý tài khoản và quyền hạn
Hệ thống phân quyền sử dụng theo vai trò:

•  Chủ nuôi: Đăng ký, theo dõi thông tin thú cưng, sử dụng dịch vụ.
•  Nhân viên trung tâm: Xử lý yêu cầu dịch vụ, cập nhật thông tin khám bệnh, chăm sóc.

•  Bác sĩ thú y: Quản lý bệnh án, chẩn đoán và kê đơn thuốc.
•  Quản trị viên: Quản lý tài khoản, kiểm soát dữ liệu, báo cáo thống kê.

3.7. Báo cáo và thống kê
Hệ thống cung cấp các báo cáo hỗ trợ trung tâm trong việc quản lý:
•  Thống kê số lượng thú cưng đăng ký theo thời gian.
•  Báo cáo doanh thu từ các dịch vụ.
•  Thống kê lịch sử khám chữa bệnh, dịch vụ sử dụng.

•  Phân tích xu hướng sức khỏe thú cưng (các bệnh phổ biến, tình trạng dinh dưỡng, v.v.).

4. Một số quy trình nghiệp vụ điển hình
Quy trình đặt lịch khám bệnh

1.  Chủ nuôi đăng nhập vào hệ thống và chọn đặt lịch khám.
2.  Chọn loại hình khám bệnh (khám tổng quát, tiêm phòng, xét nghiệm, v.v.).

3.  Hệ thống hiển thị các khung giờ trống để lựa chọn.
4.  Sau khi đặt lịch, hệ thống xác nhận qua email/SMS.

5.  Khi đến trung tâm, nhân viên kiểm tra và xác nhận thông tin.
6.  Bác sĩ tiến hành khám, nhập thông tin chẩn đoán, kê đơn thuốc lên hệ thống.

7.  Chủ nuôi nhận thông tin về lịch tái khám nếu cần.

Quy trình sử dụng dịch vụ lưu trú

1.  Chủ nuôi đăng ký lưu trú, nhập thông tin thú cưng và thời gian gửi.
2.  Hệ thống kiểm tra phòng trống và hiển thị giá dịch vụ.

3.  Chủ nuôi xác nhận đặt phòng và thanh toán.
4.  Khi thú cưng đến trung tâm, nhân viên tiếp nhận và cập nhật thông tin.

5.  Trong thời gian lưu trú, hệ thống cập nhật tình trạng sức khỏe, ăn uống.
6.  Khi kết thúc lưu trú, chủ nuôi nhận thông báo đến đón thú cưng.

…/…

Chủ đề 06. Hệ thống Sợi dây gắn kết

1. Mô tả

Hoạt động thiện nguyện đóng vai trò quan trọng trong việc hỗ trợ cộng đồng và giúp đỡ những
người có hoàn cảnh khó khăn. Tuy nhiên, việc kết nối giữa các tình nguyện viên, tổ chức thiện nguyện

và những cá nhân hoặc tổ chức cần trợ giúp vẫn còn nhiều hạn chế do thiếu một nền tảng tập trung,
tối ưu hóa quy trình quản lý và điều phối nguồn lực. Hệ thống "Sợi dây gắn kết" ra đời với mục tiêu

xây dựng một nền tảng trực tuyến giúp kết nối hiệu quả giữa các bên, đảm bảo sự phân bổ nguồn lực
thiện nguyện hợp lý và tối ưu.

Hệ thống hoạt động dựa trên nguyên tắc  kết nối đúng người, đúng thời điểm, đúng nhu
cầu, thông qua việc ghi nhận thông tin về kỹ năng, khả năng hỗ trợ và quỹ thời gian của tình nguyện

viên, đồng thời quản lý các nhu cầu cần trợ giúp một cách minh bạch và chính xác. Bên cạnh đó, hệ
thống còn hỗ trợ quản lý sự kiện thiện nguyện, theo dõi kết quả hoạt động, cung cấp báo cáo thống

kê nhằm nâng cao hiệu quả tổ chức và triển khai các chương trình cộng đồng.

2. Đối tượng sử dụng hệ thống
Hệ thống "Sợi dây gắn kết" được xây dựng để phục vụ ba nhóm đối tượng chính:

•  Tình nguyện viên cá nhân: Những người mong muốn tham gia hoạt động thiện nguyện, cung

cấp thời gian, kỹ năng, kiến thức để hỗ trợ cộng đồng.

•  Hội/nhóm thiện nguyện: Các tổ chức từ thiện, câu lạc bộ sinh viên, doanh nghiệp xã hội có

nhu cầu quản lý và điều phối tình nguyện viên cho các sự kiện và dự án thiện nguyện.

•  Người cần trợ giúp: Cá nhân hoặc tổ chức cần hỗ trợ trong các lĩnh vực như giáo dục, y tế,

cứu trợ, chăm sóc người già, trẻ em, v.v.

•  Quản trị viên hệ thống: Người chịu trách nhiệm giám sát hoạt động của hệ thống, quản lý tài

khoản, kiểm soát nội dung và đảm bảo tính minh bạch trong việc kết nối thiện nguyện.

3. Một số chức năng chính
(sinh viên có thể khảo sát thêm các hệ thống hoặc sản phẩm tương tự nhằm đề xuất thêm các chức
năng bổ sung nếu có)
3.1. Quản lý thông tin hội thiện nguyện
Hệ thống cho phép các hội thiện nguyện đăng ký tài khoản và cung cấp các thông tin chi tiết bao gồm:

•  Tên tổ chức, lĩnh vực hoạt động, mục tiêu hoạt động.
•  Thông tin liên hệ, người đại diện.
•  Lịch sử hoạt động, dự án đã thực hiện.

•  Thông tin tài trợ hoặc các quỹ hỗ trợ (nếu có).

3.2. Tuyển dụng và quản lý tình nguyện viên
Hệ thống hỗ trợ quy trình đăng ký và quản lý tình nguyện viên theo các bước:
1.  Đăng ký tài khoản cá nhân: Cung cấp thông tin cá nhân, liên hệ.

2.  Xác định khả năng hỗ trợ: Tình nguyện viên lựa chọn các kỹ năng có thể đóng góp như giảng

dạy, y tế, cứu trợ, công tác xã hội, truyền thông, tổ chức sự kiện, v.v.

3.  Ghi nhận quỹ thời gian: Xác định mức độ sẵn sàng tham gia theo tuần/tháng.
4.  Đánh giá và xếp hạng: Sau mỗi hoạt động, tình nguyện viên có thể nhận đánh giá từ tổ chức

để tăng uy tín trong hệ thống.
3.3. Quản lý sự kiện thiện nguyện

Hệ thống hỗ trợ hội thiện nguyện trong việc tổ chức và quản lý các sự kiện:

•  Tạo mới và quản lý thông tin sự kiện: tên sự kiện, địa điểm, thời gian, số lượng tình nguyện

viên cần thiết.

•  Quản lý danh sách đăng ký, kiểm tra sự tham gia.

•  Thống kê kết quả sau sự kiện, báo cáo tác động cộng đồng.

3.4. Quản lý các yêu cầu trợ giúp

Người cần trợ giúp có thể đăng ký tài khoản và gửi yêu cầu hỗ trợ với các thông tin chi tiết như:

•  Loại hình hỗ trợ cần thiết (nhu yếu phẩm, y tế, giáo dục, tài chính, v.v.).

•  Thời gian mong muốn nhận được trợ giúp.
•  Mức độ ưu tiên của yêu cầu.

3.5. Kết nối tình nguyện viên/hội thiện nguyện với nhu cầu trợ giúp
Hệ thống sử dụng thuật toán để tối ưu hóa việc ghép nối giữa tình nguyện viên và người cần trợ giúp,

dựa trên các tiêu chí:

•  Khả năng phù hợp của tình nguyện viên với yêu cầu.

•  Quỹ thời gian sẵn có.
•  Mức độ ưu tiên của yêu cầu.

•  Khoảng cách địa lý (nếu có liên quan).

3.6. Báo cáo và thống kê

Hệ thống cung cấp báo cáo theo từng nhóm đối tượng:

•  Cho hội thiện nguyện: Thống kê số lượng tình nguyện viên tham gia, kết quả sự kiện, hiệu

quả hoạt động.

•  Cho tình nguyện viên: Tổng hợp các hoạt động đã tham gia, số giờ thiện nguyện đã đóng góp.
•  Cho người cần trợ giúp: Theo dõi tiến trình hỗ trợ, xác nhận kết quả nhận trợ giúp.
•  Cho quản trị viên: Báo cáo tổng hợp về các hoạt động trên toàn hệ thống, đảm bảo tính minh

bạch.

4. Một số quy trình nghiệp vụ tiêu biểu
4.1. Quy trình đăng ký và quản lý tình nguyện viên

1.  Tình nguyện viên truy cập hệ thống và tạo tài khoản cá nhân.
2.  Cập nhật thông tin cá nhân, kỹ năng và thời gian sẵn có.
3.  Hệ thống xác thực tài khoản qua email/SMS.

4.  Khi có sự kiện hoặc yêu cầu hỗ trợ phù hợp, hệ thống thông báo để tình nguyện viên đăng ký

tham gia.

5.  Sau khi hoàn thành hoạt động, tình nguyện viên nhận được đánh giá và xếp hạng.

4.2. Quy trình tổ chức sự kiện thiện nguyện

1.  Hội thiện nguyện đăng nhập hệ thống và tạo sự kiện mới.
2.  Nhập thông tin chi tiết sự kiện và số lượng tình nguyện viên cần thiết.

3.  Hệ thống đề xuất danh sách tình nguyện viên phù hợp.
4.  Hội thiện nguyện xác nhận danh sách tham gia và gửi thông báo.

5.  Sau khi sự kiện kết thúc, hội thiện nguyện cập nhật kết quả, báo cáo tác động.

4.3. Quy trình yêu cầu trợ giúp

1.  Người cần trợ giúp tạo tài khoản và gửi yêu cầu.
2.  Hệ thống kiểm duyệt yêu cầu và ghép nối với tình nguyện viên phù hợp.

3.  Tình nguyện viên hoặc hội thiện nguyện xác nhận nhận nhiệm vụ.
4.  Hoạt động hỗ trợ diễn ra, kết quả được ghi nhận.

…/…

