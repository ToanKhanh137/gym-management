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

  // Chỉ điền form, người dùng tự bấm "Đăng nhập"
  const quickLogin = (email, password) => setForm({ email, password });

  return (
    <div className="login-page">
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
      <div className="login-right">
        <div className="login-logo">
          <div className="login-logo-icon"><Dumbbell size={22} color="white" /></div>
          <div>
            <div className="login-logo-name">GymPro</div>
            <div className="login-logo-tagline">Hệ thống quản lý phòng tập</div>
          </div>
        </div>

        <h1 className="login-title">Xin chào!</h1>
        <p className="login-sub">Đăng nhập để tiếp tục quản lý</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 12 }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>
          <button id="login-btn" type="submit" className="login-btn" disabled={loading}>
            {loading
            ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Đang đăng nhập...</>
            : <><Lock size={16} /> Đăng nhập</>
          }
          </button>
        </form>

        {/* Quick login for dev/demo */}
        <div style={{ marginTop: 28, borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, textAlign: 'center' }}>
            TÀI KHOẢN DEMO
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Chủ phòng tập', email: 'owner@gym.com', pw: 'owner123' },
              { label: 'Nhân viên',       email: 'staff@gym.com', pw: 'staff123' },
              { label: 'HLV cá nhân',     email: 'pt@gym.com',    pw: 'pt123' },
              { label: 'Hội viên',        email: 'member@gym.com', pw: 'member123' },
            ].map(q => (
              <button
                key={q.email}
                type="button"
                onClick={() => quickLogin(q.email, q.pw)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 10px',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
