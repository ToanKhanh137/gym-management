import { useQuery } from '@tanstack/react-query';
import { Ticket, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import api from '../api/client';

const STATUS_CONFIG = {
  active:    { label:'Đang active', icon: CheckCircle2, color:'var(--accent-green)' },
  expired:   { label:'Hết hạn',     icon: XCircle,      color:'var(--accent-red)'   },
  cancelled: { label:'Đã hủy',      icon: XCircle,      color:'var(--text-muted)'   },
};
const PAY_LABELS = { cash:'Tiền mặt', bank_transfer:'Chuyển khoản', e_wallet:'Ví điện tử' };

export default function MySubscription() {
  const { data: subs = [], isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => api.get('/subscriptions').then(r => r.data),
  });

  const active = subs.find(s => s.status === 'active');
  const history = subs.filter(s => s.status !== 'active');

  const getDaysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000*60*60*24));
    return diff;
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gói tập của tôi</h1>
        <p className="page-subtitle">Thông tin gói tập hiện tại và lịch sử đăng ký</p>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
        ) : (
          <>
            {/* Active subscription card */}
            {active ? (() => {
              const daysLeft = getDaysLeft(active.endDate);
              const isUrgent = daysLeft !== null && daysLeft <= 7;
              return (
                <div style={{ marginBottom:24 }}>
                  <div style={{
                    background: 'linear-gradient(135deg, var(--accent-orange, #f05a28) 0%, #ff8c42 100%)',
                    borderRadius:16, padding:'24px 28px', color:'white', position:'relative', overflow:'hidden'
                  }}>
                    <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
                    <div style={{ position:'absolute', right:30, bottom:-30, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
                    <div style={{ fontSize:12, opacity:0.8, marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>Gói tập đang active</div>
                    <div style={{ fontSize:24, fontWeight:700, marginBottom:4 }}>{active.package?.name}</div>
                    <div style={{ fontSize:13, opacity:0.85, marginBottom:16 }}>{active.package?.description}</div>
                    <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
                      <div>
                        <div style={{ fontSize:11, opacity:0.7 }}>Ngày bắt đầu</div>
                        <div style={{ fontSize:14, fontWeight:600 }}>{active.startDate}</div>
                      </div>
                      {active.endDate && (
                        <div>
                          <div style={{ fontSize:11, opacity:0.7 }}>Ngày hết hạn</div>
                          <div style={{ fontSize:14, fontWeight:600 }}>{active.endDate}</div>
                        </div>
                      )}
                      {daysLeft !== null && (
                        <div>
                          <div style={{ fontSize:11, opacity:0.7 }}>Còn lại</div>
                          <div style={{ fontSize:14, fontWeight:700, color: isUrgent ? '#ffdd57' : 'white' }}>
                            {daysLeft > 0 ? `${daysLeft} ngày` : 'Hết hạn hôm nay'}
                          </div>
                        </div>
                      )}
                      {active.sessionsTotal && (
                        <div>
                          <div style={{ fontSize:11, opacity:0.7 }}>Số buổi</div>
                          <div style={{ fontSize:14, fontWeight:600 }}>{active.sessionsUsed}/{active.sessionsTotal}</div>
                        </div>
                      )}
                    </div>
                    {isUrgent && daysLeft > 0 && (
                      <div style={{ marginTop:14, padding:'8px 12px', background:'rgba(255,221,87,0.2)', borderRadius:8, border:'1px solid rgba(255,221,87,0.4)', fontSize:13 }}>
                        ⚠️ Gói tập sắp hết hạn! Liên hệ nhân viên để gia hạn.
                      </div>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="table-wrap" style={{ marginBottom:24, padding:'32px 24px', textAlign:'center' }}>
                <Ticket size={48} style={{ color:'var(--text-muted)', opacity:0.3, marginBottom:12 }}/>
                <div style={{ fontSize:15, color:'var(--text-muted)', marginBottom:6 }}>Bạn chưa có gói tập nào đang active</div>
                <div style={{ fontSize:13, color:'var(--text-muted)' }}>Liên hệ nhân viên để đăng ký gói tập</div>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="table-wrap">
                <div className="table-header">
                  <span className="table-title">Lịch sử đăng ký</span>
                </div>
                <div className="mobile-hide-table">
                  <table>
                    <thead><tr><th>Gói tập</th><th>Ngày bắt đầu</th><th>Ngày kết thúc</th><th>Thanh toán</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                      {history.map(s => {
                        const cfg = STATUS_CONFIG[s.status] || {};
                        return (
                          <tr key={s.id}>
                            <td style={{ fontWeight:500, fontSize:13 }}>{s.package?.name}</td>
                            <td style={{ fontSize:12, color:'var(--text-muted)' }}>{s.startDate}</td>
                            <td style={{ fontSize:12, color:'var(--text-muted)' }}>{s.endDate || '—'}</td>
                            <td style={{ fontSize:12 }}>{PAY_LABELS[s.paymentMethod] || s.paymentMethod}</td>
                            <td><span style={{ fontSize:12, color:cfg.color }}>{cfg.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mobile-only-cards" style={{ padding:'8px 0' }}>
                  {history.map(s => {
                    const cfg = STATUS_CONFIG[s.status] || {};
                    return (
                      <div key={s.id} style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                        <div>
                          <div style={{ fontWeight:500, fontSize:14 }}>{s.package?.name}</div>
                          <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:3 }}>{s.startDate} → {s.endDate || '∞'}</div>
                        </div>
                        <div style={{ fontSize:12, color:cfg.color, fontWeight:500 }}>{cfg.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
