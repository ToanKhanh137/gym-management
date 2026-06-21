import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dumbbell, X } from 'lucide-react';
import api from '../api/client';

const statusColor = { good: 'badge-green', maintenance: 'badge-yellow', damaged: 'badge-red', retired: 'badge-gray' };
const statusLabel = { good: 'Tốt', maintenance: 'Bảo trì', damaged: 'Hỏng', retired: 'Ngừng dùng' };

const emptyForm = { equipmentCode: '', name: '', roomId: '', quantity: 1, importedAt: '', warrantyUntil: '', origin: '' };

export default function Equipment() {
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [maintEq, setMaintEq] = useState(null);
  const [maintDesc, setMaintDesc] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({ name: '', roomId: '', quantity: 1, importedAt: '', warrantyUntil: '', origin: '', status: 'good' });

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment', filterStatus],
    queryFn: () => api.get(`/equipment${filterStatus ? `?status=${filterStatus}` : ''}`).then(r => r.data),
  });

  const { data: rooms = [] } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms').then(r => r.data),
  });



  const createEq = useMutation({
    mutationFn: (data) => api.post('/equipment', data),
    onSuccess: () => { qc.invalidateQueries(['equipment']); setShowModal(false); setForm(emptyForm); },
  });

  const updateEq = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/equipment/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(['equipment']); setShowEditModal(false); setEditTarget(null); },
  });

  const reportMaint = useMutation({
    mutationFn: ({ equipmentId, description }) => api.post('/maintenance', { equipmentId, description }),
    onSuccess: () => { qc.invalidateQueries(['equipment', 'maintenance']); setShowMaintModal(false); setMaintDesc(''); },
  });



  const openEdit = (eq) => {
    setEditTarget(eq);
    setEditForm({
      name: eq.name || '',
      roomId: eq.roomId ? String(eq.roomId) : '',
      quantity: eq.quantity || 1,
      importedAt: eq.importedAt || '',
      warrantyUntil: eq.warrantyUntil || '',
      origin: eq.origin || '',
      status: eq.status || 'good',
    });
    setShowEditModal(true);
  };



  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý Thiết bị</h1>
        <p className="page-subtitle">Danh sách thiết bị và yêu cầu bảo trì</p>
      </div>
      <div className="page-body">
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Thiết bị ({equipment.length})</span>
            <div style={{ display: 'flex', gap: 10 }}>
              <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Tất cả</option>
                <option value="good">Tốt</option>
                <option value="maintenance">Bảo trì</option>
                <option value="damaged">Hỏng</option>
              </select>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Thêm thiết bị</button>
            </div>
          </div>
          {isLoading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : equipment.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon"><Dumbbell size={36} /></div><div className="empty-state-text">Chưa có thiết bị</div></div>
          ) : (
            <>
              <div className="mobile-hide-table">
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
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Sửa thông tin"
                              onClick={() => openEdit(eq)}
                              style={{ padding: '4px 8px' }}
                            >
                              Sửa
                            </button>
                            {eq.status === 'good' && (
                              <button className="btn btn-ghost btn-sm" onClick={() => { setMaintEq(eq); setShowMaintModal(true); }}>
                                Báo hỏng
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                {equipment.map(eq => (
                  <div key={eq.id} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{eq.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mã: {eq.equipmentCode}</div>
                      </div>
                      <span className={`badge ${statusColor[eq.status]}`}>{statusLabel[eq.status]}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div>Phòng: {eq.room?.name || '—'} | Số lượng: {eq.quantity}</div>
                      <div>Ngày nhập: {eq.importedAt || '—'}</div>
                      <div style={{ marginTop: 2 }}>Bảo hành: {eq.warrantyUntil || '—'}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(eq)} style={{ padding: '4px 8px' }}>
                        Sửa
                      </button>
                      {eq.status === 'good' && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setMaintEq(eq); setShowMaintModal(true); }} style={{ padding: '4px 8px' }}>
                          Báo hỏng
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Equipment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">+ Thêm thiết bị</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
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
                  {createEq.isPending ? 'Đang lưu...' : 'Thêm thiết bị'}
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
              <span className="modal-title">Báo cáo hỏng hóc</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowMaintModal(false)}><X size={18} /></button>
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
                {reportMaint.isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Equipment Modal */}
      {showEditModal && editTarget && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Sửa thiết bị — {editTarget.equipmentCode}</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowEditModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              updateEq.mutate({
                id: editTarget.id,
                data: {
                  name: editForm.name,
                  roomId: editForm.roomId ? parseInt(editForm.roomId) : null,
                  quantity: parseInt(editForm.quantity),
                  importedAt: editForm.importedAt || null,
                  warrantyUntil: editForm.warrantyUntil || null,
                  origin: editForm.origin || null,
                  status: editForm.status,
                },
              });
            }}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Tên thiết bị *</label>
                    <input className="form-input" required value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phòng</label>
                    <select className="form-select" value={editForm.roomId}
                      onChange={e => setEditForm(f => ({ ...f, roomId: e.target.value }))}>
                      <option value="">-- Không gán phòng --</option>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số lượng</label>
                    <input className="form-input" type="number" min="1" value={editForm.quantity}
                      onChange={e => setEditForm(f => ({ ...f, quantity: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trạng thái</label>
                    <select className="form-select" value={editForm.status}
                      onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                      <option value="good">Tốt</option>
                      <option value="maintenance">Bảo trì</option>
                      <option value="damaged">Hỏng</option>
                      <option value="retired">Ngừng dùng</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày nhập</label>
                    <input className="form-input" type="date" value={editForm.importedAt}
                      onChange={e => setEditForm(f => ({ ...f, importedAt: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bảo hành đến</label>
                    <input className="form-input" type="date" value={editForm.warrantyUntil}
                      onChange={e => setEditForm(f => ({ ...f, warrantyUntil: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Xuất xứ</label>
                    <input className="form-input" placeholder="Việt Nam, Mỹ..." value={editForm.origin}
                      onChange={e => setEditForm(f => ({ ...f, origin: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={updateEq.isPending}>
                  {updateEq.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
