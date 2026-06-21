import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import api from '../api/client';

export default function TrainerStudents() {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['trainer-students'],
    queryFn: () => api.get('/trainers/mine/students').then(r => r.data),
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Học viên của tôi</h1>
        <p className="page-subtitle">Danh sách học viên bạn đang phụ trách</p>
      </div>

      <div className="page-body">
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Danh sách học viên ({students.length})</span>
          </div>

          {isLoading ? (
            <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize:36, opacity:0.3 }}><Users size={40}/></div>
              <div className="empty-state-text">Bạn chưa được gán học viên nào</div>
            </div>
          ) : (
            <>
              <div className="mobile-hide-table">
                <table>
                  <thead>
                    <tr>
                      <th>Học viên</th>
                      <th>Liên hệ</th>
                      <th>Gói tập</th>
                      <th>Ngày bắt đầu</th>
                      <th>Tiến độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{s.member?.user?.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mã: {s.member?.memberCode}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13 }}>{s.member?.user?.phone || '—'}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.member?.user?.email}</div>
                        </td>
                        <td style={{ fontWeight: 500, fontSize: 13 }}>{s.package?.name}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.startDate}</td>
                        <td style={{ fontSize: 13, fontWeight: 500 }}>
                          {s.sessionsTotal ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>{s.sessionsUsed} / {s.sessionsTotal} buổi</span>
                              <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${(s.sessionsUsed/s.sessionsTotal)*100}%`, height: '100%', background: 'var(--accent-blue)' }} />
                              </div>
                            </div>
                          ) : 'Không giới hạn'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                {students.map(s => (
                  <div key={s.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{s.member?.user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mã: {s.member?.memberCode}</div>
                      </div>
                      <span className="badge badge-blue" style={{ fontSize: 11 }}>{s.package?.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div>SĐT: {s.member?.user?.phone || '—'}</div>
                      <div>Email: {s.member?.user?.email}</div>
                      <div style={{ marginTop: 2 }}>Ngày bắt đầu: {s.startDate}</div>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
                        Tiến độ: {s.sessionsTotal ? `${s.sessionsUsed} / ${s.sessionsTotal} buổi` : 'Không giới hạn'}
                      </div>
                      {s.sessionsTotal && (
                        <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${(s.sessionsUsed/s.sessionsTotal)*100}%`, height: '100%', background: 'var(--accent-blue)' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
