import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, LogIn, LogOut } from 'lucide-react';
import api from '../api/client';

export default function MyTraining() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['my-training-logs'],
    queryFn: () => api.get('/training-logs').then(r => r.data),
  });

  const totalSessions = logs.length;
  const thisMonth = logs.filter(l => {
    const d = new Date(l.checkedInAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalMinutes = logs.reduce((sum, l) => {
    if (!l.checkedInAt || !l.checkedOutAt) return sum;
    return sum + Math.round((new Date(l.checkedOutAt) - new Date(l.checkedInAt)) / 60000);
  }, 0);
  const avgMinutes = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;

  const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' }) : '—';
  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('vi-VN', { weekday:'short', day:'2-digit', month:'2-digit' }) : '—';
  const duration = (inTime, outTime) => {
    if (!inTime || !outTime) return null;
    const mins = Math.round((new Date(outTime) - new Date(inTime)) / 60000);
    return mins >= 60 ? `${Math.floor(mins/60)}h${mins%60 ? (mins%60)+'p' : ''}` : `${mins} phút`;
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Lịch sử tập luyện</h1>
        <p className="page-subtitle">Theo dõi quá trình tập luyện của bạn</p>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
        ) : (
          <>
            {/* KPI cards */}
            <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
              <div className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
                <div style={{ fontSize:28, fontWeight:700, color:'var(--accent-blue, #00d4ff)' }}>{totalSessions}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Tổng buổi tập</div>
              </div>
              <div className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
                <div style={{ fontSize:28, fontWeight:700, color:'var(--accent-green, #22c55e)' }}>{thisMonth}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Tháng này</div>
              </div>
              <div className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
                <div style={{ fontSize:28, fontWeight:700, color:'var(--accent-purple, #a78bfa)' }}>{avgMinutes}</div>
                <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Phút/buổi (TB)</div>
              </div>
            </div>

            {logs.length === 0 ? (
              <div className="table-wrap">
                <div className="empty-state">
                  <div className="empty-state-icon" style={{ fontSize:36, opacity:0.3 }}><Calendar size={40}/></div>
                  <div className="empty-state-text">Chưa có lịch sử tập luyện</div>
                </div>
              </div>
            ) : (
              <div className="table-wrap">
                <div className="table-header">
                  <span className="table-title">Chi tiết buổi tập <span style={{ color:'var(--text-muted)', fontWeight:400 }}>({logs.length})</span></span>
                </div>
                <div className="mobile-hide-table">
                  <table>
                    <thead><tr><th>Ngày</th><th>Check-in</th><th>Check-out</th><th>Thời gian</th><th>Gói tập</th><th>Ghi chú</th></tr></thead>
                    <tbody>
                      {logs.map(l => (
                        <tr key={l.id}>
                          <td style={{ fontWeight:500, fontSize:13 }}>{formatDate(l.checkedInAt)}</td>
                          <td>
                            <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--accent-green)', fontSize:13 }}>
                              <LogIn size={13}/> {formatTime(l.checkedInAt)}
                            </span>
                          </td>
                          <td>
                            {l.checkedOutAt ? (
                              <span style={{ display:'flex', alignItems:'center', gap:4, color:'var(--accent-red)', fontSize:13 }}>
                                <LogOut size={13}/> {formatTime(l.checkedOutAt)}
                              </span>
                            ) : <span className="badge badge-green" style={{ fontSize:10 }}>Đang tập</span>}
                          </td>
                          <td>
                            {duration(l.checkedInAt, l.checkedOutAt)
                              ? <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:13 }}><Clock size={12}/> {duration(l.checkedInAt, l.checkedOutAt)}</span>
                              : '—'}
                          </td>
                          <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{l.subscription?.package?.name || '—'}</td>
                          <td style={{ fontSize:12, color:'var(--text-muted)' }}>{l.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mobile-only-cards" style={{ padding:'8px 0' }}>
                  {logs.map(l => (
                    <div key={l.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <div style={{ fontWeight:600, fontSize:14 }}>{formatDate(l.checkedInAt)}</div>
                        {l.checkedOutAt
                          ? <span style={{ fontSize:12, color:'var(--text-muted)' }}>{duration(l.checkedInAt, l.checkedOutAt)}</span>
                          : <span className="badge badge-green" style={{ fontSize:10 }}>Đang tập</span>}
                      </div>
                      <div style={{ display:'flex', gap:16, marginTop:6, fontSize:13 }}>
                        <span style={{ color:'var(--accent-green)', display:'flex', alignItems:'center', gap:4 }}><LogIn size={12}/> {formatTime(l.checkedInAt)}</span>
                        {l.checkedOutAt && <span style={{ color:'var(--accent-red)', display:'flex', alignItems:'center', gap:4 }}><LogOut size={12}/> {formatTime(l.checkedOutAt)}</span>}
                      </div>
                      {l.subscription?.package?.name && <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:4 }}>{l.subscription.package.name}</div>}
                      {l.notes && <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:4, fontStyle:'italic' }}>{l.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
