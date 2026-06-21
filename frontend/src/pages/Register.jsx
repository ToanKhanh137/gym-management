import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import gymBg from '../assets/gym_bg.png';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', dob: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone || null, form.dob || null);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left — hero image */}
      <div className="login-left">
        <img src={gymBg} alt="Gym" className="login-bg" />
        <div className="login-overlay">
          <p className="login-quote">
            Hành trình vạn dặm<br />bắt đầu từ <span>bước chân đầu tiên</span>.
          </p>
          <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            GymPro Management System
          </p>
        </div>
      </div>

      {/* Right — register form */}
      <div className="login-right">
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => navigate('/login')} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <ArrowLeft size={13} /> Quay lại đăng nhập
          </button>
        </div>

        <div className="login-logo">
          <div className="login-logo-icon"><Dumbbell size={22} color="white" /></div>
          <div>
            <div className="login-logo-name">GymPro</div>
            <div className="login-logo-tagline">Đăng ký hội viên mới</div>
          </div>
        </div>

        <h1 className="login-title">Đăng ký tài khoản</h1>
        <p className="login-sub">Trở thành hội viên để theo dõi dịch vụ</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Họ và tên *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu *</label>
            <input
              className="form-input"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                className="form-input"
                type="tel"
                placeholder="0987xxxxxx"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ngày sinh</label>
              <input
                className="form-input"
                type="date"
                value={form.dob}
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
              />
            </div>
          </div>

          <button id="register-btn" type="submit" className="login-btn" disabled={loading} style={{ marginTop: 8 }}>
            {loading
              ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Đang xử lý...</>
              : 'Đăng ký ngay'
            }
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: 'var(--text-secondary)' }}>
          Đã có tài khoản? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
