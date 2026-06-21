import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, User, Mail, Lock, Phone, Calendar, Loader2, ArrowLeft } from 'lucide-react';
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
    <div className="login-page" style={{ overflowY: 'auto' }}>
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
      <div className="login-right" style={{ maxWidth: 400, padding: '24px 20px', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => navigate('/login')} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
            <ArrowLeft size={13} /> Quay lại đăng nhập
          </button>
        </div>

        <div className="login-logo" style={{ marginBottom: 16 }}>
          <div className="login-logo-icon" style={{ width: 36, height: 36, fontSize: 18 }}><Dumbbell size={18} color="white" /></div>
          <div>
            <div className="login-logo-name" style={{ fontSize: 16 }}>GymPro</div>
            <div className="login-logo-tagline" style={{ fontSize: 10 }}>Đăng ký hội viên mới</div>
          </div>
        </div>

        <h1 className="login-title" style={{ fontSize: 20, marginBottom: 4 }}>Đăng ký tài khoản</h1>
        <p className="login-sub" style={{ fontSize: 13, marginBottom: 16 }}>Trở thành hội viên để theo dõi dịch vụ</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 12, padding: '8px 12px', fontSize: 13 }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} style={{ gap: 10 }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Họ và tên *</label>
            <input
              className="form-input"
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              style={{ padding: '8px 12px', fontSize: 13 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Email *</label>
            <input
              className="form-input"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              style={{ padding: '8px 12px', fontSize: 13 }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Mật khẩu *</label>
            <input
              className="form-input"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
              style={{ padding: '8px 12px', fontSize: 13 }}
            />
          </div>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Số điện thoại</label>
              <input
                className="form-input"
                type="tel"
                placeholder="0987xxxxxx"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                style={{ padding: '8px 12px', fontSize: 13 }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Ngày sinh</label>
              <input
                className="form-input"
                type="date"
                value={form.dob}
                onChange={e => setForm(f => ({ ...f, dob: e.target.value }))}
                style={{ padding: '8px 12px', fontSize: 13 }}
              />
            </div>
          </div>

          <button id="register-btn" type="submit" className="login-btn" disabled={loading} style={{ marginTop: 8, padding: '10px', fontSize: 13 }}>
            {loading
              ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Đang xử lý...</>
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
