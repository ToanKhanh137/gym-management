import { useQuery } from '@tanstack/react-query';
import { User, Ticket, Calendar, MessageSquare, Dumbbell } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const fmtCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function MemberProfile() {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => api.get('/members/my/profile').then(r => r.data),
  });

  if (isLoading) return <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>;
  if (!profile) return <div className="page-body"><div className="alert alert-error">Không tìm thấy thông tin</div></div>;

  const activeSub = profile.subscriptions?.find(s => s.status === 'active');
  const recentLogs = (profile.trainingLogs || []).slice(0, 10);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Hồ sơ của tôi</h1>
        <p className="page-subtitle">Xin chào, <strong>{user?.name}</strong>!</p>
      </div>
      <div className="page-body">
        <div className="member-profile-grid">
          {/* Left column */}
          <div>
            {/* Profile card */}
            <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
              <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'white', margin: '0 auto 12px' }}>
                {user?.name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
              <div style={{ marginTop: 8 }}>
                <span className="member-code">{profile.memberCode}</span>
              </div>
            </div>

            {/* Active subscription */}
            {activeSub ? (
              <div className="card" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
                <div className="card-title">
                  <Ticket size={14} /> Gói tập đang dùng
                </div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{activeSub.package?.name}</div>
                {activeSub.endDate && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>HSD: <strong>{activeSub.endDate}</strong></div>}
                {activeSub.sessionsTotal && (
                  <>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Buổi đã dùng: {activeSub.sessionsUsed}/{activeSub.sessionsTotal}</div>
                    <div style={{ marginTop: 8, background: 'var(--bg-surface)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(activeSub.sessionsUsed / activeSub.sessionsTotal) * 100}%`, background: 'var(--primary)', borderRadius: 4 }} />
                    </div>
                  </>
                )}
                <div style={{ fontSize: 13, color: 'var(--success)', marginTop: 8 }}>{fmtCurrency(activeSub.amountPaid)}</div>
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', borderColor: 'rgba(239,68,68,0.2)' }}>
                <Ticket size={32} style={{ color: 'var(--text-muted)', opacity: 0.3, margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Chưa có gói tập</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Liên hệ nhân viên để đăng ký</div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Stats */}
            <div className="stats-grid">
              {[
                { icon: Dumbbell,     label: 'Tổng buổi tập',   val: profile.trainingLogs?.length || 0,  color: 'var(--primary)' },
                { icon: Ticket,       label: 'Gói đã đăng ký',  val: profile.subscriptions?.length || 0, color: 'var(--accent)' },
                { icon: MessageSquare,label: 'Phản hồi đã gửi', val: profile.feedbacks?.length || 0,     color: 'var(--purple)' },
              ].map(s => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="stat-card" style={{ '--card-color': s.color, '--card-color-dim': s.color + '22' }}>
                    <div className="stat-card-icon"><Icon size={20} color={s.color} /></div>
                    <div className="stat-card-value">{s.val}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent training logs */}
            <div className="table-wrap">
              <div className="table-header">
                <span className="table-title">
                  <Calendar size={15} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                  Lịch sử tập gần đây
                </span>
              </div>
              {recentLogs.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Dumbbell size={36} /></div>
                  <div className="empty-state-text">Chưa có lượt tập nào</div>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Ngày</th><th>Check-in</th><th>Check-out</th><th>Thời gian</th></tr></thead>
                  <tbody>
                    {recentLogs.map(l => {
                      const cin = new Date(l.checkedInAt);
                      const cout = l.checkedOutAt ? new Date(l.checkedOutAt) : null;
                      const mins = cout ? Math.round((cout - cin) / 60000) : null;
                      return (
                        <tr key={l.id}>
                          <td style={{ fontSize: 13 }}>{cin.toLocaleDateString('vi-VN')}</td>
                          <td style={{ fontSize: 13 }}>{cin.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                          <td style={{ fontSize: 13 }}>{cout ? cout.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : <span className="badge badge-orange">Đang tập</span>}</td>
                          <td style={{ fontSize: 13 }}>{mins ? `${mins} phút` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
