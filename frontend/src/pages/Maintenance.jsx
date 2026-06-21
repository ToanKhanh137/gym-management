import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Wrench } from 'lucide-react';
import api from '../api/client';

export default function Maintenance() {
  const qc = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: maintenance = [], isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => api.get('/maintenance').then(r => r.data),
  });

  const resolveMaint = useMutation({
    mutationFn: (id) => api.patch(`/maintenance/${id}/resolve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  const filtered = maintenance.filter(m => filterStatus === 'all' || m.status === filterStatus);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý Bảo trì</h1>
        <p className="page-subtitle">Theo dõi và xử lý các yêu cầu bảo trì thiết bị</p>
      </div>

      <div className="page-body">
        <div style={{ display:'flex', gap:12, marginBottom:20 }}>
          {[['pending','Đang chờ xử lý'],['resolved','Đã hoàn thành']].map(([s,l]) => (
            <div key={s} className="stat-card" style={{ flex:'1 1 200px', padding:'12px 16px' }}>
              <div style={{ fontSize:22, fontWeight:700 }}>{maintenance.filter(x=>x.status===s).length}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Lịch sử bảo trì ({filtered.length})</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <select className="form-select" style={{ width: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="pending">Đang chờ</option>
                <option value="resolved">Đã sửa</option>
              </select>
            </div>
          </div>
          {isLoading ? (
             <div className="loading-spinner"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Wrench size={36} /></div>
              <div className="empty-state-text">Chưa có yêu cầu bảo trì nào</div>
            </div>
          ) : (
            <>
              <div className="mobile-hide-table">
                <table>
                  <thead>
                    <tr>
                      <th>Mã BB</th>
                      <th>Thiết bị</th>
                      <th>Người báo</th>
                      <th>Ngày báo</th>
                      <th>Mô tả lỗi</th>
                      <th>Trạng thái</th>
                      <th>Xử lý bởi</th>
                      <th>Ngày sửa</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => (
                      <tr key={m.id}>
                        <td><span className="member-code">#{m.id.toString().padStart(4,'0')}</span></td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{m.equipment?.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.equipment?.equipmentCode}</div>
                        </td>
                        <td style={{ fontSize: 13 }}>{m.reportedBy?.name}</td>
                        <td style={{ fontSize: 12 }}>{new Date(m.reportedAt).toLocaleDateString('vi-VN')}</td>
                        <td style={{ fontSize: 13, maxWidth: 200 }}>{m.description}</td>
                        <td>
                          {m.status === 'pending' ? <span className="badge badge-yellow">Đang chờ</span> : <span className="badge badge-green">Đã sửa</span>}
                        </td>
                        <td style={{ fontSize: 13 }}>{m.resolvedBy?.name || '—'}</td>
                        <td style={{ fontSize: 12 }}>{m.resolvedAt ? new Date(m.resolvedAt).toLocaleDateString('vi-VN') : '—'}</td>
                        <td>
                          {m.status === 'pending' && (
                            <button className="btn btn-success btn-sm" onClick={() => { if(window.confirm('Xác nhận đã sửa xong thiết bị này?')) resolveMaint.mutate(m.id); }}>
                              <CheckCircle size={14} style={{ marginRight: 4 }}/> Xong
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                {filtered.map(m => (
                  <div key={m.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{m.equipment?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.equipment?.equipmentCode}</div>
                      </div>
                      {m.status === 'pending' ? <span className="badge badge-yellow">Đang chờ</span> : <span className="badge badge-green">Đã sửa</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div>Mã BB: <span className="member-code">#{m.id.toString().padStart(4,'0')}</span></div>
                      <div>Người báo: {m.reportedBy?.name} | Ngày báo: {new Date(m.reportedAt).toLocaleDateString('vi-VN')}</div>
                      <div style={{ marginTop: 2, background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: 4, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-primary)' }}>
                        <strong>Lỗi:</strong> {m.description}
                      </div>
                      {m.status === 'resolved' && (
                        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
                          Sửa bởi: {m.resolvedBy?.name || '—'} lúc {new Date(m.resolvedAt).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                    {m.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button className="btn btn-success btn-sm" onClick={() => { if(window.confirm('Xác nhận đã sửa xong thiết bị này?')) resolveMaint.mutate(m.id); }}>
                          <CheckCircle size={14} style={{ marginRight: 4 }}/> Xong
                        </button>
                      </div>
                    )}
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
