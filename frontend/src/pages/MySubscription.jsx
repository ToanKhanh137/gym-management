import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ticket, CheckCircle2, XCircle, Plus, X, AlertTriangle } from 'lucide-react';
import api from '../api/client';

const STATUS_CONFIG = {
  active: { label: 'Đang active', icon: CheckCircle2, color: 'var(--accent-green)' },
  expired: { label: 'Hết hạn', icon: XCircle, color: 'var(--accent-red)' },
  cancelled: { label: 'Đã hủy', icon: XCircle, color: 'var(--text-muted)' },
};
const PAY_LABELS = { cash: 'Tiền mặt', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' };

export default function MySubscription() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ packageId: '', paymentMethod: 'cash', trainerId: '' });
  const [formError, setFormError] = useState('');

  const { data: subs = [], isLoading } = useQuery({
    queryKey: ['my-subscriptions'],
    queryFn: () => api.get('/subscriptions').then(r => r.data),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data),
  });

  const { data: trainers = [] } = useQuery({
    queryKey: ['trainers'],
    queryFn: () => api.get('/trainers').then(r => r.data),
  });

  const createSub = useMutation({
    mutationFn: (data) => api.post('/subscriptions/mine', data),
    onSuccess: () => {
      qc.invalidateQueries(['my-subscriptions']);
      setShowModal(false);
      setForm({ packageId: '', paymentMethod: 'cash', trainerId: '' });
    },
    onError: (err) => setFormError(err.response?.data?.error || 'Lỗi khi đăng ký gói')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.packageId) { setFormError('Vui lòng chọn gói tập'); return; }
    createSub.mutate({ packageId: parseInt(form.packageId), paymentMethod: form.paymentMethod, trainerId: form.trainerId ? parseInt(form.trainerId) : undefined });
  };

  const activePackages = packages.filter(p => p.isActive);
  const selectedPkg = activePackages.find(p => p.id === parseInt(form.packageId));

  const active = subs.find(s => s.status === 'active');
  const history = subs.filter(s => s.status !== 'active');

  const getDaysLeft = (endDate) => {
    if (!endDate) return null;
    const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Gói tập của tôi</h1>
          <p className="page-subtitle">Thông tin gói tập hiện tại và lịch sử đăng ký</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} /> Đăng ký gói mới
        </button>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
        ) : (
          <>
            {/* Active subscription card */}
            {active ? (() => {
              const daysLeft = getDaysLeft(active.endDate);
              const isUrgent = daysLeft !== null && daysLeft <= 7;
              return (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    background: 'linear-gradient(135deg, var(--accent-orange, #f05a28) 0%, #ff8c42 100%)',
                    borderRadius: 16, padding: '24px 28px', color: 'white', position: 'relative', overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <div style={{ position: 'absolute', right: 30, bottom: -30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Gói tập đang active</div>
                    <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{active.package?.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>{active.package?.description}</div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 11, opacity: 0.7 }}>Ngày bắt đầu</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{active.startDate}</div>
                      </div>
                      {active.endDate && (
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.7 }}>Ngày hết hạn</div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{active.endDate}</div>
                        </div>
                      )}
                      {daysLeft !== null && (
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.7 }}>Còn lại</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isUrgent ? '#ffdd57' : 'white' }}>
                            {daysLeft > 0 ? `${daysLeft} ngày` : 'Hết hạn hôm nay'}
                          </div>
                        </div>
                      )}
                      {active.sessionsTotal && (
                        <div>
                          <div style={{ fontSize: 11, opacity: 0.7 }}>Số buổi</div>
                          <div style={{ fontSize: 14, fontWeight: 600 }}>{active.sessionsUsed}/{active.sessionsTotal}</div>
                        </div>
                      )}
                    </div>
                    {isUrgent && daysLeft > 0 && (
                      <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(255,221,87,0.2)', borderRadius: 8, border: '1px solid rgba(255,221,87,0.4)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertTriangle size={14} /> Gói tập sắp hết hạn! Liên hệ nhân viên để gia hạn.
                      </div>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="table-wrap" style={{ marginBottom: 24, padding: '32px 24px', textAlign: 'center' }}>
                <Ticket size={48} style={{ color: 'var(--text-muted)', opacity: 0.3, marginBottom: 12 }} />
                <div style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 6 }}>Bạn chưa có gói tập nào đang active</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Hãy đăng ký một gói tập mới để bắt đầu ngay!</div>
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
                            <td style={{ fontWeight: 500, fontSize: 13 }}>{s.package?.name}</td>
                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.startDate}</td>
                            <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.endDate || '—'}</td>
                            <td style={{ fontSize: 12 }}>{PAY_LABELS[s.paymentMethod] || s.paymentMethod}</td>
                            <td><span style={{ fontSize: 12, color: cfg.color }}>{cfg.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                  {history.map(s => {
                    const cfg = STATUS_CONFIG[s.status] || {};
                    return (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>{s.package?.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{s.startDate} → {s.endDate || '∞'}</div>
                        </div>
                        <div style={{ fontSize: 12, color: cfg.color, fontWeight: 500 }}>{cfg.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 500 }}>
            <div className="modal-header">
              <h2 className="modal-title">Đăng ký gói tập mới</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {formError && <div style={{ color: 'var(--accent-red)', fontSize: 13, marginBottom: 16 }}>{formError}</div>}
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Gói tập *</label>
                  <select className="form-input" required value={form.packageId} onChange={e => setForm(f => ({ ...f, packageId: e.target.value }))}>
                    <option value="">-- Chọn gói tập --</option>
                    {activePackages.map(p => (
                      <option key={p.id} value={p.id}>{p.name} — {p.price?.toLocaleString('vi-VN')}đ</option>
                    ))}
                  </select>
                </div>
                {selectedPkg?.type === 'pt' && (
                  <div className="form-group">
                    <label className="form-label">Huấn luyện viên phụ trách *</label>
                    <select className="form-input" required value={form.trainerId} onChange={e => setForm(f => ({ ...f, trainerId: e.target.value }))}>
                      <option value="">-- Chọn HLV --</option>
                      {trainers.map(t => (
                        <option key={t.id} value={t.id}>{t.user?.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Phương thức thanh toán</label>
                  <select className="form-input" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}>
                    <option value="cash">Tiền mặt (tại quầy)</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="e_wallet">Ví điện tử</option>
                  </select>
                </div>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary" disabled={createSub.isPending}>
                    {createSub.isPending ? 'Đang xử lý...' : 'Đăng ký & Thanh toán'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
