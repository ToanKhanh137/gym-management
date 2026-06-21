import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClipboardList, Plus, X, Search, Printer, RefreshCw } from 'lucide-react';
import api from '../api/client';

const STATUS_BADGE = {
  active:    <span className="badge badge-green">Đang dùng</span>,
  expired:   <span className="badge badge-red">Hết hạn</span>,
  cancelled: <span className="badge badge-gray">Đã hủy</span>,
};
const PAY_LABELS = { cash: 'Tiền mặt', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' };
const empty = { memberId: '', packageId: '', paymentMethod: 'cash', startDate: '', trainerId: '' };

export default function Subscriptions() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(empty);
  const [formError, setFormError] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [renewTarget, setRenewTarget] = useState(null);
  const [renewPaymentMethod, setRenewPaymentMethod] = useState('cash');
  const [renewError, setRenewError] = useState('');

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

  const { data: trainers = [] } = useQuery({
    queryKey: ['trainers'],
    queryFn: () => api.get('/trainers').then(r => r.data),
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

  const renewSub = useMutation({
    mutationFn: ({ id, paymentMethod }) => api.post(`/subscriptions/${id}/renew`, { paymentMethod }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subscriptions'] });
      setRenewTarget(null);
      setRenewError('');
    },
    onError: (e) => setRenewError(e.response?.data?.error || 'Không thể gia hạn gói'),
  });

  const openModal = () => { setForm(empty); setFormError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(empty); setFormError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.memberId || !form.packageId) { setFormError('Chọn hội viên và gói tập'); return; }
    createSub.mutate({ ...form, memberId: parseInt(form.memberId), packageId: parseInt(form.packageId), trainerId: form.trainerId ? parseInt(form.trainerId) : undefined });
  };

  const filtered = subs.filter(s => {
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const q = memberSearch.toLowerCase();
    const matchName = !q || s.member?.user?.name?.toLowerCase().includes(q) || s.member?.user?.email?.toLowerCase().includes(q);
    return matchStatus && matchName;
  });

  const activePackages = packages.filter(p => p.isActive);
  const selectedPkg = activePackages.find(p => p.id === parseInt(form.packageId));

  const printReceipt = (sub) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Biên lai thanh toán</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; }
            .header p { margin: 5px 0 0; color: #666; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { font-weight: bold; }
            .total { font-size: 20px; font-weight: bold; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Biên lai thanh toán</h1>
            <p>GymPro Management System</p>
          </div>
          <div class="row"><span class="label">Mã hóa đơn:</span> <span>#INV-${sub.id.toString().padStart(6, '0')}</span></div>
          <div class="row"><span class="label">Ngày lập:</span> <span>${new Date(sub.createdAt).toLocaleDateString('vi-VN')}</span></div>
          <div class="row"><span class="label">Khách hàng:</span> <span>${sub.member?.user?.name}</span></div>
          <div class="row"><span class="label">Gói tập:</span> <span>${sub.package?.name}</span></div>
          <div class="row"><span class="label">Huấn luyện viên:</span> <span>${sub.trainer?.user?.name || 'Không'}</span></div>
          <div class="row"><span class="label">Thời hạn:</span> <span>${sub.startDate} đến ${sub.endDate || 'Vô thời hạn'}</span></div>
          <div class="row"><span class="label">Hình thức TT:</span> <span>${PAY_LABELS[sub.paymentMethod] || sub.paymentMethod}</span></div>
          <div class="total">Tổng tiền: ${sub.amountPaid?.toLocaleString('vi-VN')} VNĐ</div>
          <div style="text-align: center; margin-top: 50px; color: #888; font-style: italic;">
            Cảm ơn quý khách đã sử dụng dịch vụ!
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

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
                        <td style={{ fontWeight:500, fontSize:13 }}>
                          {s.package?.name}
                          {s.renewals?.length > 0 && (
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                              Đã gia hạn {s.renewals.length} lần
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize:12, color:'var(--text-muted)' }}>{s.startDate}</td>
                        <td style={{ fontSize:12, color: s.status==='expired' ? 'var(--accent-red)' : 'var(--text-muted)' }}>{s.endDate || '—'}</td>
                        <td style={{ fontSize:13 }}>{s.sessionsTotal ? `${s.sessionsUsed}/${s.sessionsTotal}` : '—'}</td>
                        <td style={{ fontSize:12 }}>{PAY_LABELS[s.paymentMethod] || s.paymentMethod}</td>
                        <td>{STATUS_BADGE[s.status]}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <button className="btn btn-ghost btn-sm btn-icon" title="In biên lai" onClick={() => printReceipt(s)}>
                              <Printer size={14} color="var(--accent-blue)" />
                            </button>
                            {s.status !== 'cancelled' && (
                              <button
                                className="btn btn-ghost btn-sm"
                                style={{ color: 'var(--primary)', fontSize: 11 }}
                                onClick={() => { setRenewTarget(s); setRenewPaymentMethod('cash'); setRenewError(''); }}
                              >
                                <RefreshCw size={13} /> Gia hạn
                              </button>
                            )}
                            {s.status === 'active' && (
                              <button className="btn btn-ghost btn-sm" style={{ color:'var(--accent-red)', fontSize:11 }}
                                onClick={() => { if(window.confirm('Hủy gói này?')) cancelSub.mutate(s.id); }}>
                                Hủy
                              </button>
                            )}
                          </div>
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
                        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => printReceipt(s)}>
                            <Printer size={14} color="var(--accent-blue)" />
                          </button>
                          {s.status !== 'cancelled' && (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--primary)', fontSize: 11 }}
                              onClick={() => { setRenewTarget(s); setRenewPaymentMethod('cash'); setRenewError(''); }}
                            >
                              Gia hạn
                            </button>
                          )}
                          {s.status === 'active' && (
                            <button className="btn btn-ghost btn-sm" style={{ color:'var(--accent-red)', fontSize:11 }}
                              onClick={() => { if(window.confirm('Hủy gói này?')) cancelSub.mutate(s.id); }}>Hủy</button>
                          )}
                        </div>
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
                  {(selectedPkg?.type === 'pt' || selectedPkg?.type === 'vip') && (
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label className="form-label">Huấn luyện viên phụ trách {selectedPkg?.type === 'pt' ? '*' : '(nếu có)'}</label>
                      <select className="form-input" required={selectedPkg?.type === 'pt'} value={form.trainerId} onChange={e => setForm(f=>({...f,trainerId:e.target.value}))}>
                        <option value="">-- Chọn HLV --</option>
                        {trainers.map(t => (
                          <option key={t.id} value={t.id}>{t.user?.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
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

      {renewTarget && (
        <div className="modal-overlay" onClick={() => setRenewTarget(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Gia hạn gói tập</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setRenewTarget(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              {renewError && <div className="alert alert-error">{renewError}</div>}
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700 }}>{renewTarget.member?.user?.name}</div>
                <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{renewTarget.package?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  {renewTarget.package?.durationDays
                    ? `Cộng thêm ${renewTarget.package.durationDays} ngày`
                    : `Cộng thêm ${renewTarget.package?.totalSessions || 0} buổi`}
                </div>
                <div style={{ fontSize: 14, color: 'var(--success)', fontWeight: 700, marginTop: 8 }}>
                  {renewTarget.package?.price?.toLocaleString('vi-VN')}đ
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phương thức thanh toán</label>
                <select className="form-input" value={renewPaymentMethod} onChange={(e) => setRenewPaymentMethod(e.target.value)}>
                  <option value="cash">Tiền mặt</option>
                  <option value="bank_transfer">Chuyển khoản</option>
                  <option value="e_wallet">Ví điện tử</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setRenewTarget(null)}>Hủy</button>
              <button
                className="btn btn-primary"
                disabled={renewSub.isPending}
                onClick={() => renewSub.mutate({ id: renewTarget.id, paymentMethod: renewPaymentMethod })}
              >
                <RefreshCw size={15} /> {renewSub.isPending ? 'Đang gia hạn...' : 'Xác nhận gia hạn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
