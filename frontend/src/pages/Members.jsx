import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronRight, X, Users } from 'lucide-react';
import api from '../api/client';

const statusBadge = {
  active:    <span className="badge badge-green">Active</span>,
  expired:   <span className="badge badge-red">Hết hạn</span>,
  cancelled: <span className="badge badge-gray">Đã hủy</span>,
};

const avatarColors = ['#f05a28','#00d4ff','#22c55e','#a78bfa','#f59e0b','#ef4444'];
const getAvatarColor = (id) => avatarColors[id % avatarColors.length];
const getInitials = (name) => name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

export default function Members() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', dob:'', occupation:'' });
  const [formError, setFormError] = useState('');

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['members', search],
    queryFn: () => api.get(`/members${search ? `?search=${search}` : ''}`).then(r => r.data),
  });

  const createMember = useMutation({
    mutationFn: (data) => api.post('/members', data),
    onSuccess: () => {
      qc.invalidateQueries(['members']);
      setShowModal(false);
      setForm({ name:'', email:'', password:'', phone:'', dob:'', occupation:'' });
    },
    onError: (e) => setFormError(e.response?.data?.error || 'Lỗi tạo hội viên'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.password || form.password.length < 6) { setFormError('Mật khẩu tối thiểu 6 ký tự'); return; }
    createMember.mutate(form);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Quản lý Hội viên</h1>
        <p className="page-subtitle">Danh sách và thông tin hội viên đã đăng ký</p>
      </div>

      <div className="page-body">
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title">
              Hội viên <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({members.length})</span>
            </span>
            <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'flex-end' }}>
              <div className="search-box" style={{ flex: 1, maxWidth: 280 }}>
                <Search size={14} className="search-icon" />
                <input
                  className="search-input"
                  placeholder="Tìm tên, email, SĐT..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" style={{ flexShrink: 0 }} onClick={() => { setShowModal(true); setFormError(''); }}>
                <Plus size={15} /><span className="mobile-hide-text"> Thêm hội viên</span>
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
          ) : members.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ fontSize: 36, opacity: 0.3 }}><Users size={36} /></div>
              <div className="empty-state-text">{search ? 'Không tìm thấy hội viên' : 'Chưa có hội viên nào'}</div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="mobile-hide-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hội viên</th><th>Mã HV</th><th>Liên hệ</th>
                      <th>Gói tập</th><th>Trạng thái</th><th>Ngày đăng ký</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => {
                      const sub = m.subscriptions?.[0];
                      return (
                        <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/members/${m.id}`)}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="avatar avatar-sm" style={{ background: getAvatarColor(m.id), color: 'white' }}>
                                {getInitials(m.user?.name)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 13 }}>{m.user?.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.user?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="member-code">{m.memberCode}</span></td>
                          <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.user?.phone || '—'}</td>
                          <td>
                            {sub ? (
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{sub.package?.name}</div>
                                {sub.endDate && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>HSD: {sub.endDate}</div>}
                              </div>
                            ) : <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Chưa đăng ký</span>}
                          </td>
                          <td>{sub ? (statusBadge[sub.status] || <span className="badge badge-gray">{sub.status}</span>) : <span className="badge badge-gray">Chưa có gói</span>}</td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(m.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td onClick={e => e.stopPropagation()}>
                            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/members/${m.id}`)}><ChevronRight size={14} /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                {members.map(m => {
                  const sub = m.subscriptions?.[0];
                  return (
                    <div key={m.id} onClick={() => navigate(`/members/${m.id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div className="avatar avatar-md" style={{ background: getAvatarColor(m.id), color: 'white', flexShrink: 0 }}>
                        {getInitials(m.user?.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.user?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          <span className="member-code">{m.memberCode}</span>
                          {m.user?.phone && <span style={{ marginLeft: 8 }}>{m.user.phone}</span>}
                        </div>
                        {sub && <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 3 }}>{sub.package?.name}</div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                        {sub ? statusBadge[sub.status] : <span className="badge badge-gray" style={{ fontSize: 10 }}>Chưa có gói</span>}
                        <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Thêm hội viên mới</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {formError && <div className="alert alert-error">{formError}</div>}
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input className="form-input" placeholder="Nguyễn Văn A" required
                      value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="email@example.com" required
                      value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mật khẩu *</label>
                    <input className="form-input" type="password" placeholder="Tối thiểu 6 ký tự" required
                      value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input className="form-input" placeholder="09xxxxxxxx"
                      value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày sinh</label>
                    <input className="form-input" type="date"
                      value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nghề nghiệp</label>
                    <input className="form-input" placeholder="Sinh viên, Nhân viên văn phòng..."
                      value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={createMember.isPending}>
                  {createMember.isPending ? 'Đang tạo...' : 'Tạo hội viên'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

