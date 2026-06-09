import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Plus, X, Search } from 'lucide-react';
import api from '../api/client';

const STATUS_BADGE = {
  active:    <span className="badge badge-green">Đang dùng</span>,
  expired:   <span className="badge badge-red">Hết hạn</span>,
  cancelled: <span className="badge badge-gray">Đã hủy</span>,
};
const PAY_LABELS = { cash: 'Tiền mặt', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' };
const empty = { memberId: '', packageId: '', paymentMethod: 'cash', startDate: '' };

export default function Subscriptions() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(empty);
  const [formError, setFormError] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: subs = [], isLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: () => api.get('/subscriptions').then(r => r.data),
  });

  const { data: members = [] } = useQuery({
    queryKey: ['members-all'],
    queryFn: () => api.get('/members').then(r => r.data),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data),
  });

  const createSub = useMutation({
    mutationFn: (data) => api.post('/subscriptions', data),
    onSuccess: () => { qc.invalidateQueries(['subscriptions']); closeModal(); },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi đăng ký gói'),
  });

  const cancelSub = useMutation({
    mutationFn: (id) => api.patch(`/subscriptions/${id}/cancel`),
    onSuccess: () => qc.invalidateQueries(['subscriptions']),
  });

  const openModal = () => { setForm(empty); setFormError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(empty); setFormError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.memberId || !form.packageId) { setFormError('Chọn hội viên và gói tập'); return; }
    createSub.mutate({ ...form, memberId: parseInt(form.memberId), packageId: parseInt(form.packageId) });
  };

  const filtered = subs.filter(s => {
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const q = memberSearch.toLowerCase();
    const matchName = !q || s.member?.user?.name?.toLowerCase().includes(q) || s.member?.user?.email?.toLowerCase().includes(q);
    return matchStatus && matchName;
  });

  const activePackages = packages.filter(p => p.isActive);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Đăng ký / Gia hạn Gói tập</h1>
        <p className="page-subtitle">Quản lý đăng ký gói tập của hội viên</p>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div style={{ display:'flex', gap:12, marginBottom:20, flexWrap:'wrap' }}>
          {[['active','Đang active','badge-green'],['expired','Hết hạn','badge-red'],['cancelled','Đã hủy','badge-gray']].map(([s,l]) => (
            <div key={s} className="stat-card" style={{ flex:'1 1 120px', minWidth:100, padding:'12px 16px' }}>
              <div style={{ fontSize:22, fontWeight:700 }}>{subs.filter(x=>x.status===s).length}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Gói đăng ký <span style={{ color:'var(--text-muted)', fontWeight:400 }}>({filtered.length})</span></span>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'flex-end' }}>
              <div className="search-box" style={{ flex:1, maxWidth:220 }}>
                <Search size={14} className="search-icon"/>
                <input className="search-input" placeholder="Tìm hội viên..." value={memberSearch} onChange={e => setMemberSearch(e.target.value)}/>
              </div>
              <select className="form-input btn-sm" style={{ width:'auto', padding:'4px 10px', fontSize:13 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="active">Đang dùng</option>
                <option value="expired">Hết hạn</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <button className="btn btn-primary" style={{ flexShrink:0 }} onClick={openModal}>
                <Plus size={15}/><span className="mobile-hide-text"> Đăng ký mới</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize:36, opacity:0.3 }}><ClipboardList size={40}/></div>
              <div className="empty-state-text">Không có gói đăng ký nào</div>
            </div>
          ) : (
            <>
              <div className="mobile-hide-table">
                <table>
                  <thead><tr><th>Hội viên</th><th>Gói tập</th><th>Ngày bắt đầu</th><th>Hạn dùng</th><th>Số buổi</th><th>Thanh toán</th><th>Trạng thái</th><th></th></tr></thead>
                  <tbody>
                    {filtered.map(s => (
                      <tr key={s.id}>
                        <td>
                          <div style={{ fontWeight:600, fontSize:13 }}>{s.member?.user?.name}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.member?.user?.email}</div>
                        </td>
                        <td style={{ fontWeight:500, fontSize:13 }}>{s.package?.name}</td>
                        <td style={{ fontSize:12, color:'var(--text-muted)' }}>{s.startDate}</td>
                        <td style={{ fontSize:12, color: s.status==='expired' ? 'var(--accent-red)' : 'var(--text-muted)' }}>{s.endDate || '—'}</td>
                        <td style={{ fontSize:13 }}>{s.sessionsTotal ? `${s.sessionsUsed}/${s.sessionsTotal}` : '—'}</td>
                        <td style={{ fontSize:12 }}>{PAY_LABELS[s.paymentMethod] || s.paymentMethod}</td>
                        <td>{STATUS_BADGE[s.status]}</td>
                        <td>
                          {s.status === 'active' && (
                            <button className="btn btn-ghost btn-sm" style={{ color:'var(--accent-red)', fontSize:11 }}
                              onClick={() => { if(window.confirm('Hủy gói này?')) cancelSub.mutate(s.id); }}>
                              Hủy
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-only-cards" style={{ padding:'8px 0' }}>
                {filtered.map(s => (
                  <div key={s.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14 }}>{s.member?.user?.name}</div>
                        <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>{s.package?.name}</div>
                        <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>
                          {s.startDate} → {s.endDate || '∞'}
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                        {STATUS_BADGE[s.status]}
                        {s.status === 'active' && (
                          <button className="btn btn-ghost btn-sm" style={{ color:'var(--accent-red)', fontSize:11 }}
                            onClick={() => { if(window.confirm('Hủy gói này?')) cancelSub.mutate(s.id); }}>Hủy</button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Đăng ký gói tập mới</span>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Hội viên *</label>
                    <select className="form-input" required value={form.memberId} onChange={e => setForm(f=>({...f,memberId:e.target.value}))}>
                      <option value="">-- Chọn hội viên --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.user?.name} ({m.memberCode})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ gridColumn:'1/-1' }}>
                    <label className="form-label">Gói tập *</label>
                    <select className="form-input" required value={form.packageId} onChange={e => setForm(f=>({...f,packageId:e.target.value}))}>
                      <option value="">-- Chọn gói tập --</option>
                      {activePackages.map(p => (
                        <option key={p.id} value={p.id}>{p.name} — {p.price?.toLocaleString('vi-VN')}đ</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày bắt đầu</label>
                    <input className="form-input" type="date" value={form.startDate} onChange={e => setForm(f=>({...f,startDate:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thanh toán *</label>
                    <select className="form-input" value={form.paymentMethod} onChange={e => setForm(f=>({...f,paymentMethod:e.target.value}))}>
                      <option value="cash">Tiền mặt</option>
                      <option value="bank_transfer">Chuyển khoản</option>
                      <option value="e_wallet">Ví điện tử</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={createSub.isPending}>
                  {createSub.isPending ? 'Đang đăng ký...' : 'Đăng ký gói'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
