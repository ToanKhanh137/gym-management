import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const fmtCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const TYPE_LABEL = { per_session: 'Theo buổi', monthly: 'Tháng', quarterly: 'Quý', yearly: 'Năm', vip: 'VIP', pt: 'PT cá nhân' };
const TYPE_COLOR = { per_session: 'badge-blue', monthly: 'badge-green', quarterly: 'badge-orange', yearly: 'badge-purple', vip: 'badge-yellow', pt: 'badge-red' };

export default function Packages() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editPkg, setEditPkg] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'monthly', durationDays: '', totalSessions: '', price: '', description: '' });
  const [formError, setFormError] = useState('');

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => api.get('/packages').then(r => r.data),
  });

  const save = useMutation({
    mutationFn: (data) => editPkg ? api.patch(`/packages/${editPkg.id}`, data) : api.post('/packages', data),
    onSuccess: () => { qc.invalidateQueries(['packages']); closeModal(); },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi lưu gói tập'),
  });

  const deactivate = useMutation({
    mutationFn: (id) => api.delete(`/packages/${id}`),
    onSuccess: () => qc.invalidateQueries(['packages']),
  });

  const openEdit = (pkg) => {
    setEditPkg(pkg);
    setForm({ name: pkg.name, type: pkg.type, durationDays: pkg.durationDays || '', totalSessions: pkg.totalSessions || '', price: pkg.price, description: pkg.description || '' });
    setShowModal(true); setFormError('');
  };

  const openCreate = () => {
    setEditPkg(null);
    setForm({ name: '', type: 'monthly', durationDays: '', totalSessions: '', price: '', description: '' });
    setShowModal(true); setFormError('');
  };

  const closeModal = () => { setShowModal(false); setEditPkg(null); };

  const handleSubmit = (e) => {
    e.preventDefault(); setFormError('');
    const data = { ...form, price: parseFloat(form.price), durationDays: form.durationDays ? parseInt(form.durationDays) : null, totalSessions: form.totalSessions ? parseInt(form.totalSessions) : null };
    save.mutate(data);
  };

  const isOwner = user?.role === 'owner';

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý Gói tập</h1>
        <p className="page-subtitle">Các gói tập hiện có tại phòng gym</p>
      </div>

      <div className="page-body">
        {isOwner && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn btn-primary" onClick={openCreate}>+ Tạo gói tập mới</button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {packages.map(pkg => (
              <div key={pkg.id} className="card" style={{
                border: pkg.isActive ? '1px solid var(--border)' : '1px solid rgba(239,68,68,0.2)',
                opacity: pkg.isActive ? 1 : 0.6,
                transition: 'all 0.2s',
                position: 'relative',
              }}
                onMouseEnter={e => { if(pkg.isActive) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={e => e.currentTarget.style.borderColor = pkg.isActive ? 'var(--border)' : 'rgba(239,68,68,0.2)'}
              >
                {!pkg.isActive && (
                  <span className="badge badge-red" style={{ position: 'absolute', top: 12, right: 12 }}>Đã tắt</span>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 32 }}>
                    {pkg.type === 'vip' ? '👑' : pkg.type === 'pt' ? '💪' : pkg.type === 'yearly' ? '📅' : '🎫'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{pkg.name}</div>
                    <span className={`badge ${TYPE_COLOR[pkg.type] || 'badge-gray'}`}>{TYPE_LABEL[pkg.type] || pkg.type}</span>
                  </div>
                </div>

                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}>
                  {fmtCurrency(pkg.price)}
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                  {pkg.durationDays && `⏱ ${pkg.durationDays} ngày`}
                  {pkg.totalSessions && `🎯 ${pkg.totalSessions} buổi`}
                </div>

                {pkg.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{pkg.description}</p>
                )}

                {isOwner && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(pkg)}>✏️ Sửa</button>
                    {pkg.isActive && (
                      <button className="btn btn-danger btn-sm"
                        onClick={() => { if (confirm('Tắt gói tập này?')) deactivate.mutate(pkg.id); }}>
                        Tắt
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editPkg ? '✏️ Sửa gói tập' : '+ Tạo gói tập mới'}</span>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="form-group">
                  <label className="form-label">Tên gói *</label>
                  <input className="form-input" placeholder="Gói 3 tháng, Gói VIP..." required
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Loại gói *</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giá (VNĐ) *</label>
                    <input className="form-input" type="number" placeholder="1500000" required min="0"
                      value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số ngày hiệu lực</label>
                    <input className="form-input" type="number" placeholder="90 (để trống nếu theo buổi)"
                      value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số buổi (nếu theo buổi)</label>
                    <input className="form-input" type="number" placeholder="10"
                      value={form.totalSessions} onChange={e => setForm(f => ({ ...f, totalSessions: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mô tả</label>
                  <input className="form-input" placeholder="Mô tả ngắn về gói tập..."
                    value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={save.isPending}>
                  {save.isPending ? 'Đang lưu...' : '✓ Lưu gói tập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
