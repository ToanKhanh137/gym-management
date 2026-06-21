import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Dumbbell, Star, Ticket, X } from 'lucide-react';
import api from '../api/client';

const statusBadge = {
  active: <span className="badge badge-green">● Active</span>,
  expired: <span className="badge badge-red">Hết hạn</span>,
  cancelled: <span className="badge badge-gray">Đã hủy</span>,
};
const paymentLabel = { cash: 'Tiền mặt', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' };
const fmtCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function MemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState('info');
  const [showSubModal, setShowSubModal] = useState(false);
  const [subForm, setSubForm] = useState({ packageId: '', paymentMethod: 'cash', startDate: new Date().toISOString().split('T')[0] });
  const [subError, setSubError] = useState('');

  const { data: member, isLoading } = useQuery({
    queryKey: ['member', id],
    queryFn: () => api.get(`/members/${id}`).then(r => r.data),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data),
  });

  const registerSub = useMutation({
    mutationFn: (data) => api.post('/subscriptions', data),
    onSuccess: () => { qc.invalidateQueries(['member', id]); setShowSubModal(false); },
    onError: (e) => setSubError(e.response?.data?.error || 'Lỗi đăng ký'),
  });

  const cancelSub = useMutation({
    mutationFn: (subId) => api.patch(`/subscriptions/${subId}/cancel`),
    onSuccess: () => qc.invalidateQueries(['member', id]),
  });

  const updateMember = useMutation({
    mutationFn: (data) => api.patch(`/members/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(['member', id]);
      alert('Đã cập nhật mật khẩu hội viên thành công!');
    },
    onError: (e) => alert(e.response?.data?.error || 'Lỗi cập nhật'),
  });

  const handleResetPassword = () => {
    const newPwd = prompt('Nhập mật khẩu mới cho hội viên (tối thiểu 6 ký tự):');
    if (newPwd === null) return; // Hủy
    if (newPwd.trim().length < 6) {
      alert('Mật khẩu phải từ 6 ký tự trở lên!');
      return;
    }
    updateMember.mutate({ password: newPwd.trim() });
  };

  if (isLoading) return <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>;
  if (!member) return <div className="page-body"><div className="alert alert-error">Không tìm thấy hội viên</div></div>;

  const activeSub = member.subscriptions?.find(s => s.status === 'active');
  const initials = member.user?.name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

  return (
    <>
      <div className="page-header">
        <div className="flex flex-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/members')}>← Quay lại</button>
          <div>
            <h1 className="page-title">{member.user?.name}</h1>
            <p className="page-subtitle">
              <span className="member-code">{member.memberCode}</span>
              <span style={{ margin: '0 8px', color: 'var(--text-muted)' }}>·</span>
              Đăng ký: {new Date(member.createdAt).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="member-detail-grid">
          {/* Left — Profile card */}
          <div>
            <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
              <div className="avatar avatar-lg" style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                color: 'white', margin: '0 auto 12px',
              }}>{initials}</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{member.user?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{member.user?.email}</div>
              <div style={{ marginTop: 12 }}>
                {activeSub
                  ? <span className="badge badge-green">Gói đang active</span>
                  : <span className="badge badge-red">Chưa có gói</span>}
              </div>
            </div>

            <div className="card">
              <div className="card-title"><ClipboardList size={14} /> Thông tin cá nhân</div>
              {[
                { label: 'SĐT', val: member.user?.phone || '—' },
                { label: 'Ngày sinh', val: member.user?.dob || '—' },
                { label: 'Nghề nghiệp', val: member.occupation || '—' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span>{r.val}</span>
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-ghost btn-sm w-full" 
                style={{ marginTop: 12, justifyContent: 'center', fontSize: 12, color: 'var(--text-muted)' }}
                onClick={handleResetPassword}
              >
                🔒 Đổi mật khẩu tài khoản
              </button>
            </div>

            {/* Active Subscription */}
            {activeSub && (
              <div className="card" style={{ marginTop: 16, borderColor: 'rgba(34,197,94,0.3)' }}>
                <div className="card-title"><Ticket size={14} /> Gói đang tập</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{activeSub.package?.name}</div>
                {activeSub.endDate && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Hết hạn: {activeSub.endDate}
                  </div>
                )}
                {activeSub.sessionsTotal && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Buổi còn lại: {activeSub.sessionsTotal - activeSub.sessionsUsed}/{activeSub.sessionsTotal}
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>
                  {fmtCurrency(activeSub.amountPaid)}
                </div>
                <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }}
                  onClick={() => { if (confirm('Xác nhận hủy gói tập?')) cancelSub.mutate(activeSub.id); }}>
                  Hủy gói
                </button>
              </div>
            )}

            <button className="btn btn-primary w-full" style={{ marginTop: 12 }}
              onClick={() => { setShowSubModal(true); setSubError(''); }}>
              + Đăng ký gói tập mới
            </button>
          </div>

          {/* Right — Tabs */}
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--bg-card)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
              {[
                { id: 'info',     label: 'Gói tập',     icon: Ticket },
                { id: 'logs',     label: 'Lịch sử tập', icon: Dumbbell },
                { id: 'feedback', label: 'Phản hồi',    icon: Star },
              ].map(t => (
                <button key={t.id}
                  className={`btn btn-sm ${tab === t.id ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ border: 'none' }}
                  onClick={() => setTab(t.id)}>
                  {t.icon && <t.icon size={13} />} {t.label}
                </button>
              ))}
            </div>

            {tab === 'info' && (
              <div className="table-wrap">
                <div className="table-header"><span className="table-title">Lịch sử đăng ký gói</span></div>
                {member.subscriptions?.length === 0 ? (
                  <div className="empty-state"><div className="empty-state-icon"><Ticket size={36} /></div><div className="empty-state-text">Chưa có gói tập nào</div></div>
                ) : (
                  <table>
                    <thead><tr><th>Gói tập</th><th>Bắt đầu</th><th>Kết thúc</th><th>Thanh toán</th><th>Số tiền</th><th>Trạng thái</th></tr></thead>
                    <tbody>
                      {member.subscriptions?.map(s => (
                        <tr key={s.id}>
                          <td style={{ fontWeight: 500 }}>{s.package?.name}</td>
                          <td style={{ fontSize: 12 }}>{s.startDate}</td>
                          <td style={{ fontSize: 12 }}>{s.endDate || '—'}</td>
                          <td style={{ fontSize: 12 }}>{paymentLabel[s.paymentMethod] || s.paymentMethod}</td>
                          <td style={{ color: 'var(--success)', fontSize: 13 }}>{fmtCurrency(s.amountPaid)}</td>
                          <td>{statusBadge[s.status]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === 'logs' && (
              <div className="table-wrap">
                <div className="table-header"><span className="table-title">Lịch sử tập luyện</span></div>
                {member.trainingLogs?.length === 0 ? (
                  <div className="empty-state"><div className="empty-state-icon"><Dumbbell size={36} /></div><div className="empty-state-text">Chưa có lịch sử check-in</div></div>
                ) : (
                  <table>
                    <thead><tr><th>Ngày</th><th>Check-in</th><th>Check-out</th><th>Ghi chú</th></tr></thead>
                    <tbody>
                      {member.trainingLogs?.map(l => (
                        <tr key={l.id}>
                          <td style={{ fontSize: 12 }}>{new Date(l.checkedInAt).toLocaleDateString('vi-VN')}</td>
                          <td style={{ fontSize: 12 }}>{new Date(l.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</td>
                          <td style={{ fontSize: 12 }}>{l.checkedOutAt ? new Date(l.checkedOutAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : <span className="badge badge-orange">Đang tập</span>}</td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tab === 'feedback' && (
              <div className="table-wrap">
                <div className="table-header"><span className="table-title">Phản hồi của hội viên</span></div>
                {member.feedbacks?.length === 0 ? (
                  <div className="empty-state"><div className="empty-state-icon"><Star size={36} /></div><div className="empty-state-text">Chưa có phản hồi</div></div>
                ) : (
                  <table>
                    <thead><tr><th>Ngày</th><th>Loại</th><th>Đánh giá</th><th>Bình luận</th></tr></thead>
                    <tbody>
                      {member.feedbacks?.map(f => (
                        <tr key={f.id}>
                          <td style={{ fontSize: 12 }}>{new Date(f.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>{f.targetType}</td>
                          <td>{Array.from({length: f.rating}, (_, i) => <Star key={i} size={12} fill="#f59e0b" stroke="#f59e0b" />)}</td>
                          <td style={{ fontSize: 13 }}>{f.comment || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Register Subscription Modal */}
      {showSubModal && (
        <div className="modal-overlay" onClick={() => setShowSubModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Đăng ký gói tập</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowSubModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setSubError(''); if (!subForm.packageId) { setSubError('Chọn gói tập'); return; } registerSub.mutate({ ...subForm, memberId: parseInt(id), packageId: parseInt(subForm.packageId) }); }}>
              <div className="modal-body">
                {subError && <div className="alert alert-error">{subError}</div>}
                <div className="form-group">
                  <label className="form-label">Gói tập *</label>
                  <select className="form-select" value={subForm.packageId} onChange={e => setSubForm(f => ({ ...f, packageId: e.target.value }))} required>
                    <option value="">-- Chọn gói tập --</option>
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {new Intl.NumberFormat('vi-VN').format(p.price)}đ
                        {p.durationDays ? ` (${p.durationDays} ngày)` : p.totalSessions ? ` (${p.totalSessions} buổi)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input className="form-input" type="date" value={subForm.startDate} onChange={e => setSubForm(f => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phương thức thanh toán</label>
                    <select className="form-select" value={subForm.paymentMethod} onChange={e => setSubForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                      <option value="cash">Tiền mặt (tại quầy)</option>
                      <option value="bank_transfer">Chuyển khoản</option>
                      <option value="e_wallet">Ví điện tử</option>
                    </select>
                  </div>
                </div>
                {subForm.packageId && (
                  <div style={{ background: 'var(--bg-surface)', padding: 12, borderRadius: 8, fontSize: 13 }}>
                    {(() => {
                      const pkg = packages.find(p => p.id === parseInt(subForm.packageId));
                      if (!pkg) return null;
                      return (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Tổng thanh toán:</span>
                          <strong style={{ color: 'var(--success)', fontSize: 16 }}>
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pkg.price)}
                          </strong>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowSubModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={registerSub.isPending}>
                  {registerSub.isPending ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
