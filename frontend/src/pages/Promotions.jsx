import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Gift, Pencil, Plus, X } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const empty = {
  title: '',
  description: '',
  discountPercent: '',
  startDate: '',
  endDate: '',
  isActive: true,
};

export default function Promotions() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => api.get('/promotions').then((r) => r.data),
  });

  const save = useMutation({
    mutationFn: (data) => editing
      ? api.patch(`/promotions/${editing.id}`, data)
      : api.post('/promotions', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['promotions'] });
      setShowModal(false);
      setEditing(null);
      setForm(empty);
    },
    onError: (err) => setError(err.response?.data?.error || 'Không thể lưu khuyến mãi'),
  });

  const toggle = useMutation({
    mutationFn: (promotion) => api.patch(`/promotions/${promotion.id}`, { isActive: !promotion.isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['promotions'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setError('');
    setShowModal(true);
  };

  const openEdit = (promotion) => {
    setEditing(promotion);
    setForm({
      title: promotion.title,
      description: promotion.description || '',
      discountPercent: promotion.discountPercent ?? '',
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      isActive: promotion.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    save.mutate(form);
  };

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Khuyến mãi</h1>
          <p className="page-subtitle">
            {user?.role === 'owner' ? 'Quản lý ưu đãi dành cho hội viên' : 'Các ưu đãi đang áp dụng tại phòng gym'}
          </p>
        </div>
        {user?.role === 'owner' && (
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Thêm khuyến mãi</button>
        )}
      </div>
      <div className="page-body">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {promotions.map((promotion) => (
              <div key={promotion.id} className="card" style={{ opacity: promotion.isActive ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Gift size={22} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{promotion.title}</div>
                      {promotion.discountPercent != null && (
                        <div style={{ color: 'var(--success)', fontWeight: 700, marginTop: 4 }}>
                          Giảm {promotion.discountPercent}%
                        </div>
                      )}
                    </div>
                  </div>
                  {user?.role === 'owner' && (
                    <button className="btn btn-ghost btn-icon" onClick={() => openEdit(promotion)} title="Chỉnh sửa">
                      <Pencil size={15} />
                    </button>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13, minHeight: 38 }}>
                  {promotion.description || 'Ưu đãi dành cho hội viên.'}
                </p>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {promotion.startDate} đến {promotion.endDate}
                </div>
                {user?.role === 'owner' && (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 12 }}
                    onClick={() => toggle.mutate(promotion)}
                  >
                    {promotion.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </button>
                )}
              </div>
            ))}
            {!promotions.length && <div className="empty-state">Chưa có chương trình khuyến mãi.</div>}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi'}</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-error">{error}</div>}
                <div className="form-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Tên chương trình *</label>
                    <input className="form-input" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giảm giá (%)</label>
                    <input className="form-input" type="number" min="0" max="100" value={form.discountPercent} onChange={(e) => setForm((f) => ({ ...f, discountPercent: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-input" value={String(form.isActive)} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === 'true' }))}>
                      <option value="true">Đang áp dụng</option>
                      <option value="false">Tạm dừng</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Từ ngày *</label>
                    <input className="form-input" type="date" required value={form.startDate} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Đến ngày *</label>
                    <input className="form-input" type="date" required value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-input" rows="3" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={save.isPending}>
                  {save.isPending ? 'Đang lưu...' : 'Lưu khuyến mãi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
