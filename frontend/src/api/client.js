import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gym_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const translateError = (errorMsg) => {
  if (!errorMsg || typeof errorMsg !== 'string') return 'Đã xảy ra lỗi không xác định.';
  
  if (errorMsg.includes('Member already has active package')) {
    const packageName = errorMsg.split(': ')[1] || 'Gói khác';
    return `Hội viên này hiện đang có gói tập "${packageName}" còn hiệu lực. Vui lòng đợi gói tập này hết hạn hoặc hủy trước khi đăng ký gói mới.`;
  }
  if (errorMsg.includes('Member already has an open check-in')) {
    return 'Hội viên này hiện đang trong phòng tập (chưa check-out).';
  }
  if (errorMsg.includes('Training log already checked out')) {
    return 'Hội viên này đã check-out ra về trước đó.';
  }
  if (errorMsg.includes('No sessions remaining')) {
    return 'Gói tập của hội viên đã hết số buổi tập cho phép.';
  }
  if (errorMsg.includes('Subscription expired')) {
    return 'Gói tập của hội viên đã hết hạn sử dụng.';
  }
  if (errorMsg.includes('Subscription not active')) {
    return 'Gói tập của hội viên không hoạt động hoặc đã hết hạn.';
  }
  if (errorMsg.includes('Subscription does not belong to this member')) {
    return 'Gói tập được chọn không thuộc về hội viên này.';
  }
  if (errorMsg.includes('Trainer must be assigned for PT packages')) {
    return 'Vui lòng chọn huấn luyện viên (PT) cho gói tập cá nhân.';
  }
  if (errorMsg.includes('Trainer not found')) {
    return 'Không tìm thấy thông tin huấn luyện viên (PT) được chỉ định.';
  }
  if (errorMsg.includes('Member not found')) {
    return 'Không tìm thấy thông tin hội viên trên hệ thống.';
  }
  if (errorMsg.includes('Package not found or inactive')) {
    return 'Gói tập không tồn tại hoặc đã ngừng áp dụng.';
  }
  if (errorMsg.includes('Invalid credentials')) {
    return 'Tên đăng nhập hoặc mật khẩu không chính xác.';
  }
  if (errorMsg.includes('Email and password are required')) {
    return 'Vui lòng cung cấp đầy đủ email và mật khẩu.';
  }
  if (errorMsg.includes('currentPassword and newPassword are required')) {
    return 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.';
  }
  if (errorMsg.includes('New password must be at least 6 characters')) {
    return 'Mật khẩu mới phải có độ dài ít nhất 6 ký tự.';
  }
  if (errorMsg.includes('Current password is incorrect')) {
    return 'Mật khẩu hiện tại không chính xác.';
  }
  if (errorMsg.includes('Cancelled subscription cannot be renewed')) {
    return 'Gói tập đã bị hủy trước đó, không thể thực hiện gia hạn.';
  }
  if (errorMsg.includes('Package is inactive')) {
    return 'Gói tập này đã ngừng cung cấp dịch vụ, không thể gia hạn.';
  }
  if (errorMsg.includes('Package has no renewable duration or sessions')) {
    return 'Gói tập không hỗ trợ gia hạn thời hạn hoặc số buổi.';
  }
  if (errorMsg.includes('Member is not allowed to register subscriptions online')) {
    return 'Hội viên không có quyền tự đăng ký gói tập trực tuyến. Vui lòng liên hệ quầy lễ tân để được hỗ trợ đăng ký.';
  }
  if (errorMsg.includes('Forbidden')) {
    return 'Bạn không có quyền thực hiện thao tác này.';
  }
  if (errorMsg.includes('Server error')) {
    return 'Lỗi máy chủ hệ thống. Vui lòng thử lại sau.';
  }
  
  return errorMsg;
};

// Handle 401/403 globally — but NOT during login or when already on /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data?.error) {
      err.response.data.error = translateError(err.response.data.error);
    }

    const isLoginEndpoint = err.config?.url?.includes('/auth/login');
    const isAlreadyOnLogin = window.location.pathname === '/login';

    if (
      err.response?.status === 401 &&
      !isLoginEndpoint &&
      !isAlreadyOnLogin
    ) {
      localStorage.removeItem('gym_token');
      localStorage.removeItem('gym_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
