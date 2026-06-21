import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, MessageSquare, Star, X } from 'lucide-react';
import api from '../api/client';

const TARGET_LABELS = { staff: 'Nhân viên', facility: 'Cơ sở vật chất', pt: 'Huấn luyện viên' };
const TARGET_COLORS = { staff: '#00d4ff', facility: '#a78bfa', pt: '#f05a28' };

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={i <= rating ? '#f59e0b' : 'none'} stroke={i <= rating ? '#f59e0b' : 'var(--text-muted)'} />
      ))}
    </div>
  );
}

export default function Feedbacks() {
  const qc = useQueryClient();
  const [resolveTarget, setResolveTarget] = useState(null);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: () => api.get('/feedbacks').then(r => r.data),
  });

  const resolveFeedback = useMutation({
    mutationFn: ({ id, responseText }) => api.patch(`/feedbacks/${id}/resolve`, { response: responseText }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['feedbacks'] });
      setResolveTarget(null);
      setResponse('');
      setError('');
    },
    onError: (err) => setError(err.response?.data?.error || 'Không thể xử lý phản hồi'),
  });

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—';

  const byTarget = Object.entries(TARGET_LABELS).map(([type, label]) => ({
    type, label,
    count: feedbacks.filter(f => f.targetType === type).length,
    avg: feedbacks.filter(f => f.targetType === type).length
      ? (feedbacks.filter(f => f.targetType === type).reduce((s,f) => s+f.rating,0) / feedbacks.filter(f => f.targetType === type).length).toFixed(1)
      : '—',
  }));

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Phản hồi & Đánh giá</h1>
        <p className="page-subtitle">Ý kiến của hội viên về dịch vụ phòng tập</p>
      </div>

      <div className="page-body">
        {/* KPI row */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          <div className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
            <div style={{ fontSize:28, fontWeight:700, color:'var(--accent-yellow, #f59e0b)' }}>{avgRating}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2, display:'flex', alignItems:'center', gap:4 }}>
              <Star size={12} fill="#f59e0b" stroke="#f59e0b"/> Đánh giá TB
            </div>
          </div>
          <div className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
            <div style={{ fontSize:28, fontWeight:700 }}>{feedbacks.length}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Tổng phản hồi</div>
          </div>
          <div className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
            <div style={{ fontSize:28, fontWeight:700, color:'var(--accent-orange)' }}>
              {feedbacks.filter((item) => item.status !== 'resolved').length}
            </div>
            <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Chờ xử lý</div>
          </div>
          {byTarget.map(t => (
            <div key={t.type} className="stat-card" style={{ flex:'1 1 140px', minWidth:120, padding:'16px 20px' }}>
              <div style={{ fontSize:22, fontWeight:700, color: TARGET_COLORS[t.type] }}>{t.avg} <span style={{ fontSize:14 }}>⭐</span></div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{t.label} ({t.count})</div>
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Danh sách phản hồi <span style={{ color:'var(--text-muted)', fontWeight:400 }}>({feedbacks.length})</span></span>
          </div>

          {isLoading ? (
            <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
          ) : feedbacks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize:36, opacity:0.3 }}><MessageSquare size={40}/></div>
              <div className="empty-state-text">Chưa có phản hồi nào</div>
            </div>
          ) : (
            <>
              <div className="mobile-hide-table">
                <table>
                  <thead>
                    <tr><th>Hội viên</th><th>Loại</th><th>Đánh giá</th><th>Nhận xét</th><th>Trạng thái</th><th></th></tr>
                  </thead>
                  <tbody>
                    {feedbacks.map(f => (
                      <tr key={f.id}>
                        <td style={{ fontWeight:600, fontSize:13 }}>{f.member?.user?.name || '—'}</td>
                        <td>
                          <span style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background: TARGET_COLORS[f.targetType]+'22', color: TARGET_COLORS[f.targetType], fontWeight:500 }}>
                            {TARGET_LABELS[f.targetType] || f.targetType}
                          </span>
                        </td>
                        <td><StarRating rating={f.rating}/></td>
                        <td style={{ fontSize:13, color:'var(--text-secondary)', maxWidth:280 }}>
                          {f.comment || <span style={{ color:'var(--text-muted)', fontStyle:'italic' }}>Không có nhận xét</span>}
                        </td>
                        <td>
                          <span className={`badge ${f.status === 'resolved' ? 'badge-green' : 'badge-yellow'}`}>
                            {f.status === 'resolved' ? 'Đã xử lý' : 'Chờ xử lý'}
                          </span>
                          {f.response && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 5, maxWidth: 220 }}>
                              {f.response}
                            </div>
                          )}
                        </td>
                        <td>
                          {f.status !== 'resolved' && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => { setResolveTarget(f); setResponse(''); setError(''); }}
                            >
                              <CheckCircle2 size={13} /> Xử lý
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-only-cards" style={{ padding:'8px 0' }}>
                {feedbacks.map(f => (
                  <div key={f.id} style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{f.member?.user?.name || '—'}</div>
                        <div style={{ marginTop:4 }}>
                          <span style={{ fontSize:10, padding:'2px 6px', borderRadius:4, background: TARGET_COLORS[f.targetType]+'22', color: TARGET_COLORS[f.targetType], fontWeight:600 }}>
                            {TARGET_LABELS[f.targetType]}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <StarRating rating={f.rating}/>
                        <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{new Date(f.createdAt).toLocaleDateString('vi-VN')}</div>
                      </div>
                    </div>
                    {f.comment && <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:6, padding:'8px 10px', background:'var(--bg-hover)', borderRadius:6 }}>{f.comment}</div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span className={`badge ${f.status === 'resolved' ? 'badge-green' : 'badge-yellow'}`}>
                        {f.status === 'resolved' ? 'Đã xử lý' : 'Chờ xử lý'}
                      </span>
                      {f.status !== 'resolved' && (
                        <button className="btn btn-primary btn-sm" onClick={() => { setResolveTarget(f); setResponse(''); setError(''); }}>
                          Xử lý
                        </button>
                      )}
                    </div>
                    {f.response && (
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                        Phản hồi: {f.response}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {resolveTarget && (
        <div className="modal-overlay" onClick={() => setResolveTarget(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Xử lý phản hồi</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setResolveTarget(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="card" style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700 }}>{resolveTarget.member?.user?.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>
                  {resolveTarget.comment || 'Không có nội dung nhận xét'}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nội dung phản hồi *</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={response}
                  onChange={(event) => setResponse(event.target.value)}
                  placeholder="Nhập cách xử lý hoặc phản hồi cho hội viên..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setResolveTarget(null)}>Hủy</button>
              <button
                className="btn btn-primary"
                disabled={resolveFeedback.isPending || !response.trim()}
                onClick={() => resolveFeedback.mutate({ id: resolveTarget.id, responseText: response })}
              >
                <CheckCircle2 size={15} /> {resolveFeedback.isPending ? 'Đang lưu...' : 'Đánh dấu đã xử lý'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
