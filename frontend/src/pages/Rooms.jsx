import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Home, Plus, X, Edit3, Dumbbell } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const TYPE_LABELS = { gym: 'Gym', yoga: 'Yoga', fitness: 'Fitness', other: 'Khác' };
const STATUS_LABELS = { active: 'Hoạt động', inactive: 'Ngừng', maintenance: 'Bảo trì' };
const STATUS_BADGE = {
  active:      <span className="badge badge-green">Hoạt động</span>,
  inactive:    <span className="badge badge-gray">Ngừng</span>,
  maintenance: <span className="badge badge-red">Bảo trì</span>,
};
const TYPE_COLORS = { gym: '#f05a28', yoga: '#a78bfa', fitness: '#00d4ff', other: '#6b7280' };

const empty = { roomCode: '', name: '', type: 'gym', capacity: '', status: 'active' };

export default function Rooms() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const isOwnerOrStaff = user?.role === 'owner' || user?.role === 'staff';

  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.get('/rooms').then(r => r.data),
  });

  const createRoom = useMutation({
    mutationFn: (data) => api.post('/rooms', data),
    onSuccess: () => { qc.invalidateQueries(['rooms']); closeModal(); },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi tạo phòng'),
  });

  const updateRoom = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/rooms/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(['rooms']); closeModal(); },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi cập nhật phòng'),
  });

  const openCreate = () => { setEditRoom(null); setForm(empty); setFormError(''); setShowModal(true); };
  const openEdit = (room) => {
    setEditRoom(room);
    setForm({ roomCode: room.roomCode, name: room.name, type: room.type, capacity: room.capacity || '', status: room.status });
    setFormError('');
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditRoom(null); setForm(empty); setFormError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    const payload = { ...form, capacity: form.capacity ? parseInt(form.capacity) : null };
    if (editRoom) {
      updateRoom.mutate({ id: editRoom.id, data: payload });
    } else {
      if (!form.roomCode || !form.name) { setFormError('Mã phòng và tên phòng là bắt buộc'); return; }
      createRoom.mutate(payload);
    }
  };

  const isPending = createRoom.isPending || updateRoom.isPending;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Phòng tập</h1>
        <p className="page-subtitle">Quản lý các phòng tập trong hệ thống</p>
      </div>

      <div className="page-body">
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const count = rooms.filter(r => r.status === status).length;
            return (
              <div key={status} className="stat-card" style={{ flex: '1 1 120px', minWidth: 100, padding: '12px 16px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: status === 'active' ? 'var(--accent-green)' : status === 'maintenance' ? 'var(--accent-red)' : 'var(--text-muted)' }}>{count}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            );
          })}
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">
              Danh sách phòng <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({rooms.length})</span>
            </span>
            {isOwnerOrStaff && (
              <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={openCreate}>
                <Plus size={15} /><span className="mobile-hide-text"> Thêm phòng</span>
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
          ) : rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 36, opacity: 0.3 }}><Home size={36} /></div>
              <div className="empty-state-text">Chưa có phòng tập nào</div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="mobile-hide-table">
                <table>
                  <thead>
                    <tr>
                      <th>Phòng</th><th>Mã phòng</th><th>Loại</th>
                      <th>Sức chứa</th><th>Thiết bị</th><th>Trạng thái</th>
                      {isOwnerOrStaff && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rooms.map(room => (
                      <tr key={room.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 8, background: TYPE_COLORS[room.type] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Home size={16} style={{ color: TYPE_COLORS[room.type] }} />
                            </div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{room.name}</div>
                          </div>
                        </td>
                        <td><span className="member-code">{room.roomCode}</span></td>
                        <td>
                          <span style={{ fontSize: 12, padding: '3px 8px', borderRadius: 6, background: TYPE_COLORS[room.type] + '22', color: TYPE_COLORS[room.type], fontWeight: 500 }}>
                            {TYPE_LABELS[room.type] || room.type}
                          </span>
                        </td>
                        <td style={{ fontSize: 13 }}>{room.capacity ? `${room.capacity} người` : '—'}</td>
                        <td style={{ fontSize: 13 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Dumbbell size={13} style={{ color: 'var(--text-muted)' }} />
                            {room._count?.equipment || 0}
                          </span>
                        </td>
                        <td>{STATUS_BADGE[room.status]}</td>
                        {isOwnerOrStaff && (
                          <td>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(room)}>
                              <Edit3 size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                {rooms.map(room => (
                  <div key={room.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: TYPE_COLORS[room.type] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Home size={20} style={{ color: TYPE_COLORS[room.type] }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{room.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        <span className="member-code">{room.roomCode}</span>
                        <span style={{ marginLeft: 8 }}>{TYPE_LABELS[room.type]}</span>
                        {room.capacity && <span style={{ marginLeft: 8 }}>· {room.capacity} người</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      {STATUS_BADGE[room.status]}
                      {isOwnerOrStaff && (
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(room)}><Edit3 size={13} /></button>
                      )}
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
              <span className="modal-title">{editRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</span>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Mã phòng *</label>
                    <input className="form-input" placeholder="VD: P001" required
                      value={form.roomCode} onChange={e => setForm(f => ({ ...f, roomCode: e.target.value }))}
                      disabled={!!editRoom} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tên phòng *</label>
                    <input className="form-input" placeholder="Phòng Gym chính" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Loại phòng</label>
                    <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="gym">Gym</option>
                      <option value="yoga">Yoga</option>
                      <option value="fitness">Fitness</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sức chứa (người)</label>
                    <input className="form-input" type="number" placeholder="30" min="1"
                      value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
                  </div>
                  {editRoom && (
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Trạng thái</label>
                      <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Ngừng hoạt động</option>
                        <option value="maintenance">Đang bảo trì</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? 'Đang lưu...' : editRoom ? 'Cập nhật' : 'Tạo phòng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
