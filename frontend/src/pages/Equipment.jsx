import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

const statusColor = { good: 'badge-green', maintenance: 'badge-yellow', broken: 'badge-red', retired: 'badge-gray' };
const statusLabel = { good: '✅ Tốt', maintenance: '🔧 Bảo trì', broken: '❌ Hỏng', retired: '📦 Ngừng dùng' };

export default function Equipment() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintEq, setMaintEq] = useState(null);
  const [maintDesc, setMaintDesc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState({ equipmentCode: '', name: '', roomId: '', quantity: 1, importedAt: '', warrantyUntil: '', origin: '' });

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment', filterStatus],
    queryFn: () => api.get(`/equipment${filterStatus ? `?status=${filterStatus}` : ''}`).then(r => r.data),
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms').then(r => r.data),
  });

  const { data: maintenance = [] } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => api.get('/maintenance').then(r => r.data),
  });

  const createEq = useMutation({
    mutationFn: (data) => api.post('/equipment', data),
    onSuccess: () => { qc.invalidateQueries(['equipment']); setShowModal(false); setForm({ equipmentCode: '', name: '', roomId: '', quantity: 1, importedAt: '', warrantyUntil: '', origin: '' }); },
  });

  const reportMaint = useMutation({
    mutationFn: ({ equipmentId, description }) => api.post('/maintenance', { equipmentId, description }),
    onSuccess: () => { qc.invalidateQueries(['equipment', 'maintenance']); setShowMaintModal(false); setMaintDesc(''); },
  });

  const resolveMaint = useMutation({
    mutationFn: (id) => api.patch(`/maintenance/${id}/resolve`),
    onSuccess: () => qc.invalidateQueries(['equipment', 'maintenance']),
  });

  const pending = maintenance.filter(m => m.status !== 'resolved');

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý Thiết bị</h1>
        <p className="page-subtitle">Danh sách thiết bị và yêu cầu bảo trì</p>
      </div>
      <div className="page-body">
        {/* Maintenance alerts */}
        {pending.length > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, padding: 14, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#f59e0b' }}>🔧 {pending.length} yêu cầu bảo trì đang chờ</div>
            {pending.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '1px solid rgba(245,158,11,0.2)', fontSize: 13 }}>
                <span><strong>{m.equipment?.name}</strong> — {m.description}</span>
                <button className="btn btn-success btn-sm" onClick={() => { if (confirm('Xác nhận đã sửa?')) resolveMaint.mutate(m.id); }}>✓ Đã sửa</button>
              </div>
            ))}
          </div>
        )}

        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Thiết bị ({equipment.length})</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="good">Tốt</option>
                <option value="maintenance">Bảo trì</option>
                <option value="broken">Hỏng</option>
              </select>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Thêm thiết bị</button>
            </div>
          </div>
          {isLoading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : equipment.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🏋️</div><div className="empty-state-text">Chưa có thiết bị</div></div>
          ) : (
            <table>
              <thead><tr><th>Mã</th><th>Tên thiết bị</th><th>Phòng</th><th>SL</th><th>Nhập ngày</th><th>Bảo hành</th><th>Trạng thái</th><th></th></tr></thead>
              <tbody>
                {equipment.map(eq => (
                  <tr key={eq.id}>
                    <td><span className="member-code">{eq.equipmentCode}</span></td>
                    <td style={{ fontWeight: 500 }}>{eq.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{eq.room?.name || '—'}</td>
                    <td>{eq.quantity}</td>
                    <td style={{ fontSize: 12 }}>{eq.importedAt || '—'}</td>
                    <td style={{ fontSize: 12 }}>{eq.warrantyUntil || '—'}</td>
                    <td><span className={`badge ${statusColor[eq.status]}`}>{statusLabel[eq.status]}</span></td>
                    <td>
                      {eq.status === 'good' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setMaintEq(eq); setShowMaintModal(true); }}>
                          🔧 Báo hỏng
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">+ Thêm thiết bị</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); createEq.mutate({ ...form, quantity: parseInt(form.quantity), roomId: form.roomId ? parseInt(form.roomId) : null }); }}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Mã thiết bị *</label>
                    <input className="form-input" placeholder="EQ003" required value={form.equipmentCode} onChange={e => setForm(f => ({ ...f, equipmentCode: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tên thiết bị *</label>
                    <input className="form-input" placeholder="Máy chạy bộ" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phòng</label>
                    <select className="form-select" value={form.roomId} onChange={e => setForm(f => ({ ...f, roomId: e.target.value }))}>
                      <option value="">-- Chọn phòng --</option>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số lượng</label>
                    <input className="form-input" type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày nhập</label>
                    <input className="form-input" type="date" value={form.importedAt} onChange={e => setForm(f => ({ ...f, importedAt: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bảo hành đến</label>
                    <input className="form-input" type="date" value={form.warrantyUntil} onChange={e => setForm(f => ({ ...f, warrantyUntil: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Xuất xứ</label>
                    <input className="form-input" placeholder="Việt Nam, Mỹ..." value={form.origin} onChange={e => setForm(f => ({ ...f, origin: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={createEq.isPending}>
                  {createEq.isPending ? 'Đang lưu...' : '✓ Thêm thiết bị'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Maintenance Modal */}
      {showMaintModal && (
        <div className="modal-overlay" onClick={() => setShowMaintModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">🔧 Báo cáo hỏng hóc</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowMaintModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Thiết bị: <strong>{maintEq?.name}</strong></p>
              <div className="form-group">
                <label className="form-label">Mô tả vấn đề *</label>
                <textarea className="form-input" rows={3} placeholder="Mô tả chi tiết hỏng hóc..."
                  value={maintDesc} onChange={e => setMaintDesc(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowMaintModal(false)}>Hủy</button>
              <button className="btn btn-primary" disabled={!maintDesc || reportMaint.isPending}
                onClick={() => reportMaint.mutate({ equipmentId: maintEq.id, description: maintDesc })}>
                {reportMaint.isPending ? 'Đang gửi...' : '✓ Gửi báo cáo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
