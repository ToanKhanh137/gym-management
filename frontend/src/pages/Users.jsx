import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, X, Edit3, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = { owner: 'Chủ phòng tập', staff: 'Nhân viên', pt: 'Huấn luyện viên', member: 'Hội viên' };
const ROLE_COLORS = { owner: '#f05a28', staff: '#00d4ff', pt: '#a78bfa', member: '#22c55e' };
const avatarColors = ['#f05a28','#00d4ff','#22c55e','#a78bfa','#f59e0b','#ef4444'];
const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
const getInitials = (name) => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';
const empty = { name: '', email: '', password: '', role: 'staff', phone: '' };

export default function Users() {
  const qc = useQueryClient();
  const { user: me } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(empty);
  const [formError, setFormError] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(r => r.data),
  });

  const createUser = useMutation({
    mutationFn: (data) => api.post('/users', data),
    onSuccess: () => { qc.invalidateQueries(['users']); closeModal(); },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi tạo tài khoản'),
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/users/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(['users']); },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi cập nhật'),
  });

  const openCreate = () => { setEditUser(null); setForm(empty); setFormError(''); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ name: u.name, email: u.email, password: '', role: u.role, phone: u.phone || '' }); setFormError(''); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditUser(null); setForm(empty); setFormError(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!editUser) {
      if (!form.password || form.password.length < 6) { setFormError('Mật khẩu tối thiểu 6 ký tự'); return; }
      createUser.mutate(form);
    } else {
      updateUser.mutate({ id: editUser.id, data: { name: form.name, phone: form.phone } });
      closeModal();
    }
  };

  const filtered = filterRole === 'all' ? users : users.filter(u => u.role === filterRole);
  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý Nhân sự</h1>
        <p className="page-subtitle">Tài khoản nhân viên và huấn luyện viên</p>
      </div>
      <div className="page-body">
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {['all','owner','staff','pt'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)}
              className={`btn ${filterRole === r ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
              {r === 'all' ? `Tất cả (${users.length})` : `${ROLE_LABELS[r]} (${users.filter(u=>u.role===r).length})`}
            </button>
          ))}
        </div>
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">Nhân sự <span style={{ color:'var(--text-muted)', fontWeight:400 }}>({filtered.length})</span></span>
            <button className="btn btn-primary" style={{ flexShrink:0 }} onClick={openCreate}>
              <Plus size={15}/><span className="mobile-hide-text"> Thêm nhân sự</span>
            </button>
          </div>
          {isLoading ? (
            <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize:36, opacity:0.3 }}>👥</div>
              <div className="empty-state-text">Không có nhân sự nào</div>
            </div>
          ) : (
            <>
              <div className="mobile-hide-table">
                <table>
                  <thead><tr><th>Nhân sự</th><th>Email</th><th>Vai trò</th><th>SĐT</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr></thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div className="avatar avatar-sm" style={{ background:getAvatarColor(u.id), color:'white' }}>{getInitials(u.name)}</div>
                            <div style={{ fontWeight:600, fontSize:13 }}>
                              {u.name}
                              {u.id === me?.id && <span style={{ fontSize:10, marginLeft:6, color:'var(--accent-blue)', background:'var(--accent-blue)22', padding:'1px 5px', borderRadius:4 }}>Bạn</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize:12, color:'var(--text-secondary)' }}>{u.email}</td>
                        <td><span style={{ fontSize:11, padding:'3px 8px', borderRadius:6, background:ROLE_COLORS[u.role]+'22', color:ROLE_COLORS[u.role], fontWeight:600 }}>{ROLE_LABELS[u.role]||u.role}</span></td>
                        <td style={{ fontSize:13 }}>{u.phone||'—'}</td>
                        <td>{u.isActive ? <span className="badge badge-green">Đang làm</span> : <span className="badge badge-gray">Vô hiệu</span>}</td>
                        <td style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>
                          <div style={{ display:'flex', gap:4 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}><Edit3 size={13}/></button>
                            {u.id !== me?.id && (
                              <button className="btn btn-ghost btn-sm" onClick={() => updateUser.mutate({ id:u.id, data:{ isActive:!u.isActive } })}>
                                {u.isActive ? <ToggleRight size={15} style={{ color:'var(--accent-green)' }}/> : <ToggleLeft size={15} style={{ color:'var(--text-muted)' }}/>}
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
                {filtered.map(u => (
                  <div key={u.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                    <div className="avatar avatar-md" style={{ background:getAvatarColor(u.id), color:'white', flexShrink:0 }}>{getInitials(u.name)}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:600, fontSize:14 }}>{u.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{u.email}</div>
                      <div style={{ marginTop:4 }}>
                        <span style={{ fontSize:10, padding:'2px 6px', borderRadius:4, background:ROLE_COLORS[u.role]+'22', color:ROLE_COLORS[u.role], fontWeight:600 }}>{ROLE_LABELS[u.role]}</span>
                      </div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                      {u.isActive ? <span className="badge badge-green" style={{ fontSize:10 }}>Active</span> : <span className="badge badge-gray" style={{ fontSize:10 }}>Off</span>}
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}><Edit3 size={13}/></button>
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
              <span className="modal-title">{editUser ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}</span>
              <button className="btn btn-ghost btn-icon" onClick={closeModal}><X size={16}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input className="form-input" placeholder="Nguyễn Văn A" required value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} disabled={!!editUser}/>
                  </div>
                  {!editUser && (
                    <div className="form-group">
                      <label className="form-label">Mật khẩu *</label>
                      <input className="form-input" type="password" placeholder="Tối thiểu 6 ký tự" required value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}/>
                    </div>
                  )}
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input className="form-input" placeholder="09xxxxxxxx" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}/>
                  </div>
                  {!editUser && (
                    <div className="form-group" style={{ gridColumn:'1/-1' }}>
                      <label className="form-label">Vai trò *</label>
                      <select className="form-input" value={form.role} onChange={e => setForm(f=>({...f,role:e.target.value}))}>
                        <option value="staff">Nhân viên quản lý</option>
                        <option value="pt">Huấn luyện viên (PT)</option>
                        <option value="owner">Chủ phòng tập</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  {isPending ? 'Đang lưu...' : editUser ? 'Cập nhật' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
