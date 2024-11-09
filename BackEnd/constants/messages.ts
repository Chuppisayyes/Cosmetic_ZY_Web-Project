// Định nghĩa các thông báo liên quan đến người dùng
export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Lỗi xác thực',  // Lỗi xác thực chung
  NAME_IS_REQUIRED: 'Tên là bắt buộc',  // Tên người dùng không được để trống
  NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi ký tự',  // Tên phải là chuỗi
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Độ dài tên phải từ 1 đến 100 ký tự',  // Tên phải có độ dài hợp lệ
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',  // Email đã được đăng ký trước đó
  EMAIL_IS_REQUIRED: 'Email là bắt buộc',  // Email không được để trống
  EMAIL_IS_INVALID: 'Email không hợp lệ',  // Email không đúng định dạng
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không chính xác',  // Thông báo khi email hoặc mật khẩu không đúng
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',  // Mật khẩu không được để trống
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi ký tự',  // Mật khẩu phải là chuỗi
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài mật khẩu phải từ 6 đến 50 ký tự',  // Độ dài mật khẩu phải hợp lệ
  PASSWORD_MUST_BE_STRONG: 'Mật khẩu phải dài từ 6-50 ký tự và chứa ít nhất 1 chữ cái viết thường, 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt',  // Mật khẩu phải đủ mạnh
  CONFIRM_PASSWORD_IS_REQUIRED: 'Mật khẩu xác nhận là bắt buộc',  // Mật khẩu xác nhận không được để trống
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Mật khẩu xác nhận phải là một chuỗi ký tự',  // Mật khẩu xác nhận phải là chuỗi
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Độ dài mật khẩu xác nhận phải từ 6 đến 50 ký tự',  // Độ dài mật khẩu xác nhận phải hợp lệ
  CONFIRM_PASSWORD_MUST_BE_STRONG: 'Mật khẩu xác nhận phải dài từ 6-50 ký tự và chứa ít nhất 1 chữ cái viết thường, 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt',  // Mật khẩu xác nhận phải đủ mạnh
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Mật khẩu xác nhận phải giống mật khẩu',  // Mật khẩu xác nhận phải giống mật khẩu
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Ngày sinh phải theo định dạng ISO8601',  // Ngày sinh phải đúng định dạng ISO8601
  LOGIN_SUCCESS: 'Đăng nhập thành công',  // Đăng nhập thành công
  REGISTER_SUCCESS: 'Đăng ký thành công',  // Đăng ký thành công
  ACCESS_TOKEN_IS_REQUIRED: 'Token truy cập là bắt buộc',  // Token truy cập không được để trống
  REFRESH_TOKEN_IS_REQUIRED: 'Token làm mới là bắt buộc',  // Token làm mới không được để trống
  REFRESH_TOKEN_IS_INVALID: 'Token làm mới không hợp lệ',  // Token làm mới không đúng
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Token làm mới đã được sử dụng hoặc không tồn tại',  // Token làm mới đã dùng hoặc không tồn tại
  LOGOUT_SUCCESS: 'Đăng xuất thành công',  // Đăng xuất thành công
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Token xác minh email là bắt buộc',  // Token xác minh email không được để trống
  USER_NOT_FOUND: 'Không tìm thấy người dùng',  // Không tìm thấy người dùng
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email đã được xác minh trước đó',  // Email đã được xác minh
  EMAIL_VERIFY_SUCCESS: 'Xác minh email thành công',  // Xác minh email thành công
  RESEND_VERIFY_EMAIL_SUCCESS: 'Gửi lại email xác minh thành công',  // Gửi lại email xác minh thành công
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Kiểm tra email để đặt lại mật khẩu',  // Kiểm tra email để thay đổi mật khẩu
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Token quên mật khẩu là bắt buộc',  // Token quên mật khẩu không được để trống
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác minh quên mật khẩu thành công',  // Xác minh quên mật khẩu thành công
  INVALID_FORGOT_PASSWORD_TOKEN: 'Token quên mật khẩu không hợp lệ',  // Token quên mật khẩu không đúng
  RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',  // Đặt lại mật khẩu thành công
  GET_ME_SUCCESS: 'Lấy thông tin cá nhân thành công',  // Lấy thông tin người dùng thành công
  USER_NOT_VERIFIED: 'Người dùng chưa được xác minh',  // Người dùng chưa xác minh email
  BIO_MUST_BE_STRING: 'Tiểu sử phải là một chuỗi ký tự',  // Tiểu sử phải là chuỗi
  BIO_LENGTH: 'Độ dài tiểu sử phải từ 1 đến 200 ký tự',  // Độ dài tiểu sử hợp lệ
  LOCATION_MUST_BE_STRING: 'Vị trí phải là một chuỗi ký tự',  // Vị trí phải là chuỗi
  LOCATION_LENGTH: 'Độ dài vị trí phải từ 1 đến 200 ký tự',  // Độ dài vị trí hợp lệ
  WEBSITE_MUST_BE_STRING: 'Website phải là một chuỗi ký tự',  // Website phải là chuỗi
  WEBSITE_LENGTH: 'Độ dài website phải từ 1 đến 200 ký tự',  // Độ dài website hợp lệ
  USERNAME_MUST_BE_STRING: 'Tên người dùng phải là một chuỗi ký tự',  // Tên người dùng phải là chuỗi
  USERNAME_INVALID: 'Tên người dùng phải có độ dài từ 4-15 ký tự và chỉ chứa chữ cái, số, dấu gạch dưới, không chỉ có số',  // Tên người dùng phải hợp lệ
  IMAGE_URL_MUST_BE_STRING: 'URL hình ảnh phải là một chuỗi ký tự',  // URL hình ảnh phải là chuỗi
  IMAGE_URL_LENGTH: 'Độ dài URL hình ảnh phải từ 1 đến 200 ký tự',  // Độ dài URL hình ảnh hợp lệ
  UPDATE_ME_SUCCESS: 'Cập nhật thông tin cá nhân thành công',  // Cập nhật thông tin thành công
  GET_PROFILE_SUCCESS: 'Lấy hồ sơ thành công',  // Lấy hồ sơ thành công
  FOLLOW_SUCCESS: 'Theo dõi thành công',  // Theo dõi thành công
  INVALID_USER_ID: 'ID người dùng không hợp lệ',  // ID người dùng không đúng
  FOLLOWED: 'Đã theo dõi',  // Đã theo dõi người dùng
  ALREADY_UNFOLLOWED: 'Đã bỏ theo dõi trước đó',  // Đã bỏ theo dõi rồi
  UNFOLLOW_SUCCESS: 'Bỏ theo dõi thành công',  // Bỏ theo dõi thành công
  USERNAME_EXISTED: 'Tên người dùng đã tồn tại',  // Tên người dùng đã có người sử dụng
  OLD_PASSWORD_NOT_MATCH: 'Mật khẩu cũ không khớp',  // Mật khẩu cũ không đúng
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',  // Đổi mật khẩu thành công
  GMAIL_NOT_VERIFIED: 'Gmail chưa được xác minh',  // Gmail chưa được xác minh
  UPLOAD_SUCCESS: 'Tải lên thành công',  // Tải tệp thành công
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công',  // Làm mới token thành công
  GET_VIDEO_STATUS_SUCCESS: 'Lấy trạng thái video thành công',  // Lấy trạng thái video thành công
} as const

// Định nghĩa các thông báo liên quan đến tweet
export const TWEETS_MESSAGES = {
  INVALID_TYPE: 'Loại tweet không hợp lệ',  // Loại tweet không hợp lệ
  INVALID_AUDIENCE: 'Đối tượng người xem không hợp lệ',  // Đối tượng người xem không hợp lệ
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'ID tweet cha phải là ID tweet hợp lệ',  // ID tweet cha phải hợp lệ
  PARENT_ID_MUST_BE_NULL: 'ID tweet cha phải là null',  // ID tweet cha phải là null
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Nội dung phải là một chuỗi không rỗng',  // Nội dung tweet không được để trống
  CONTENT_MUST_BE_EMPTY_STRING: 'Nội dung phải là chuỗi rỗng',  // Nội dung phải là chuỗi rỗng
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags phải là một mảng chuỗi',  // Hashtags phải là mảng chuỗi
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions phải là mảng ID người dùng',  // Mentions phải là mảng ID người dùng
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias phải là mảng đối tượng media',  // Medias phải là mảng đối tượng media
  INVALID_TWEET_ID: 'ID tweet không hợp lệ',  // ID tweet không hợp lệ
  TWEET_NOT_FOUND: 'Không tìm thấy tweet',  // Không tìm thấy tweet
  TWEET_IS_NOT_PUBLIC: 'Tweet không phải là công khai',  // Tweet không công khai
} as const

// Định nghĩa các thông báo liên quan đến bookmark
export const BOOKMARK_MESSAGES = {
  BOOKMARK_SUCCESSFULLY: 'Đánh dấu thành công',  // Đánh dấu tweet thành công
  UNBOOKMARK_SUCCESSFULLY: 'Bỏ đánh dấu thành công',  // Bỏ đánh dấu tweet thành công
}

// Định nghĩa các thông báo liên quan đến like
export const LIKE_MESSAGES = {
  LIKE_SUCCESSFULLY: 'Thích thành công',  // Thích tweet thành công
  UNLIKE_SUCCESSFULLY: 'Bỏ thích thành công',  // Bỏ thích tweet thành công
}
