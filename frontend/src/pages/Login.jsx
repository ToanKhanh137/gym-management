import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import gymBg from '../assets/gym_bg.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'member') navigate('/profile');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Tự động đăng nhập luôn khi chọn tài khoản demo
  const quickLogin = async (email, password) => {
    setForm({ email, password });
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'member') navigate('/profile');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
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
            Không có <span>giới hạn</span> nào<br />ngoài những giới hạn bạn tự đặt ra.
          </p>
          <p style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            GymPro Management System
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="login-right" style={{ maxWidth: 400, justifyContent: 'center', padding: '32px 24px', overflowY: 'auto' }}>
        <div className="login-logo" style={{ marginBottom: 20 }}>
          <div className="login-logo-icon" style={{ width: 36, height: 36, fontSize: 18 }}><Dumbbell size={18} color="white" /></div>
          <div>
            <div className="login-logo-name" style={{ fontSize: 16 }}>GymPro</div>
            <div className="login-logo-tagline" style={{ fontSize: 10 }}>Hệ thống quản lý phòng tập</div>
          </div>
        </div>

        <h1 className="login-title" style={{ fontSize: 20, marginBottom: 4 }}>Xin chào!</h1>
        <p className="login-sub" style={{ fontSize: 13, marginBottom: 20 }}>Đăng nhập để tiếp tục quản lý</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 12, padding: '8px 12px', fontSize: 13 }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} style={{ gap: 12 }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Email</label>
            <input
              id="email"
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
            <label className="form-label" style={{ fontSize: 12, marginBottom: 4 }}>Mật khẩu</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              style={{ padding: '8px 12px', fontSize: 13 }}
            />
          </div>
          <button id="login-btn" type="submit" className="login-btn" disabled={loading} style={{ padding: '10px', fontSize: 13, marginTop: 4 }}>
            {loading
            ? <><Loader2 size={15} style={{ animation: 'spin 0.7s linear infinite' }} /> Đang đăng nhập...</>
            : <><Lock size={15} /> Đăng nhập</>
          }
          </button>
        </form>

        <p style={{ marginTop: 16, fontSize: 13, textAlign: 'center', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản? <a href="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký ngay</a>
        </p>

        {/* Quick login for dev/demo */}
        <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <label className="form-label" style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, display: 'block', textAlign: 'center' }}>
            TRẢI NGHIỆM NHANH (DEMO ACCOUNTS)
          </label>
          <select
            className="form-input"
            style={{ fontSize: 12, padding: '8px 12px', height: 'auto', background: 'var(--bg-card)', cursor: 'pointer' }}
            onChange={(e) => {
              if (e.target.value) {
                const [email, pw] = e.target.value.split('|');
                quickLogin(email, pw);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>-- Chọn tài khoản demo để vào nhanh --</option>
            <option value="owner@gym.com|owner123">Chủ phòng tập (Owner)</option>
            <option value="staff@gym.com|staff123">Nhân viên quản lý (Staff)</option>
            <option value="pt@gym.com|pt123">Huấn luyện viên cá nhân (PT)</option>
            <option value="member@gym.com|member123">Hội viên (Member)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
