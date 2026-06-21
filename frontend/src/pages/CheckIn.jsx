import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { UserCheck, LogOut, Users, X } from 'lucide-react';
import api from '../api/client';

export default function CheckIn() {
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedSub, setSelectedSub] = useState('');
  const [checkinNotes, setCheckinNotes] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [checkoutTarget, setCheckoutTarget] = useState(null);
  const [checkoutNotes, setCheckoutNotes] = useState('');

  const { data: members = [] } = useQuery({
    queryKey: ['members', memberSearch],
    queryFn: () => api.get(`/members?search=${memberSearch}`).then(r => r.data),
    enabled: memberSearch.length > 1,
  });

  const { data: todayLogs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['today-logs'],
    queryFn: () => api.get('/training-logs').then(r =>
      r.data.filter(l => new Date(l.checkedInAt).toDateString() === new Date().toDateString())
    ),
    refetchInterval: 10000,
  });

  const checkin = useMutation({
    mutationFn: (data) => api.post('/training-logs', data),
    onSuccess: () => {
      setSuccess(`Check-in thành công cho ${selectedMember?.user?.name}!`);
      setError('');
      setSelectedMember(null); setMemberSearch(''); setSelectedSub('');
      setCheckinNotes('');
      refetchLogs();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (e) => setError(e.response?.data?.error || 'Check-in thất bại'),
  });

  const checkout = useMutation({
    mutationFn: ({ id, notes }) => api.patch(`/training-logs/${id}/checkout`, { notes }),
    onSuccess: () => {
      refetchLogs();
      setCheckoutTarget(null);
      setCheckoutNotes('');
    },
  });

  const selectMember = (m) => {
    setSelectedMember(m); setMemberSearch(m.user?.name);
    const subs = m.subscriptions?.filter(s => s.status === 'active') || [];
    setSelectedSub(subs.length === 1 ? subs[0].id.toString() : '');
  };

  const handleCheckin = () => {
    setError('');
    if (!selectedMember) { setError('Vui lòng chọn hội viên'); return; }
    if (!selectedSub) { setError('Vui lòng chọn gói tập'); return; }
    checkin.mutate({ 
      memberId: selectedMember.id, 
      subscriptionId: parseInt(selectedSub),
      notes: checkinNotes 
    });
  };

  const activeSubs = selectedMember?.subscriptions?.filter(s => s.status === 'active') || [];
  const stillIn = todayLogs.filter(l => !l.checkedOutAt);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Check-in Hội viên</h1>
        <p className="page-subtitle">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
        </p>
      </div>

      <div className="page-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Check-in form */}
        <div className="card">
          <div className="card-title"><UserCheck size={15} /> Thực hiện Check-in</div>

          {success && <div className="alert alert-success" style={{ marginBottom: 14 }}>{success}</div>}
          {error && <div className="alert alert-error" style={{ marginBottom: 14 }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Tìm hội viên *</label>
              <input className="form-input" placeholder="Nhập tên, email hoặc SĐT..."
                value={memberSearch}
                onChange={e => { setMemberSearch(e.target.value); setSelectedMember(null); setSelectedSub(''); }} />
            </div>

            {/* Search dropdown */}
            {memberSearch.length > 1 && !selectedMember && members.length > 0 && (
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                {members.slice(0, 5).map(m => {
                  const hasSub = m.subscriptions?.some(s => s.status === 'active');
                  return (
                    <div key={m.id} onClick={() => selectMember(m)}
                      style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>{m.user?.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.memberCode} · {m.user?.email}</div>
                      </div>
                      {!hasSub && <span style={{ fontSize: 11, color: 'var(--danger)', flexShrink: 0 }}>Hết gói</span>}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Selected member */}
            {selectedMember && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontWeight: 600 }}>{selectedMember.user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  <span className="member-code">{selectedMember.memberCode}</span>
                </div>
              </div>
            )}

            {/* Package select */}
            {selectedMember && (
              <div className="form-group">
                <label className="form-label">Gói tập *</label>
                <select className="form-select" value={selectedSub} onChange={e => setSelectedSub(e.target.value)}>
                  <option value="">-- Chọn gói --</option>
                  {activeSubs.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.package?.name}{s.sessionsTotal ? ` (còn ${s.sessionsTotal - s.sessionsUsed} buổi)` : s.endDate ? ` (HSD: ${s.endDate})` : ''}
                    </option>
                  ))}
                </select>
                {activeSubs.length === 0 && <p style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>Không có gói active</p>}
              </div>
            )}

            {/* Check-in notes */}
            {selectedMember && selectedSub && (
              <div className="form-group">
                <label className="form-label">Ghi chú check-in (Không bắt buộc)</label>
                <textarea
                  className="form-input"
                  placeholder="Nhập ghi chú hoặc tình trạng sức khỏe hôm nay..."
                  value={checkinNotes}
                  onChange={e => setCheckinNotes(e.target.value)}
                  rows={2}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleCheckin} disabled={checkin.isPending || !selectedMember}>
              <UserCheck size={16} />
              {checkin.isPending ? 'Đang xử lý...' : 'Check-in ngay'}
            </button>
          </div>
        </div>

        {/* Today's log */}
        <div className="table-wrap">
          <div className="table-header">
            <span className="table-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={15} /> Hôm nay ({todayLogs.length} lượt)
            </span>
            {stillIn.length > 0 && (
              <span className="badge badge-orange">{stillIn.length} đang tập</span>
            )}
          </div>

          {todayLogs.length === 0 ? (
            <div className="empty-state">
              <Users size={36} style={{ opacity: 0.2 }} />
              <div className="empty-state-text">Chưa có lượt check-in hôm nay</div>
            </div>
          ) : (
            <>
              <div className="mobile-hide-table">
                <table>
                  <thead>
                    <tr>
                      <th>Hội viên</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...todayLogs].reverse().map(log => (
                      <tr key={log.id}>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{log.member?.user?.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.member?.memberCode}</div>
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {new Date(log.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>
                          {log.checkedOutAt ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: 13 }}>
                                {new Date(log.checkedOutAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {log.notes && (
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  Ghi chú: {log.notes}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="badge badge-orange">Đang tập</span>
                          )}
                        </td>
                        <td>
                          {!log.checkedOutAt && (
                            <button className="btn btn-ghost btn-sm" onClick={() => { setCheckoutTarget(log); setCheckoutNotes(log.notes || ''); }}>
                              <LogOut size={13} /> Out
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
                {[...todayLogs].reverse().map(log => (
                  <div key={log.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: 0, marginRight: 12 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{log.member?.user?.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{log.member?.memberCode}</div>
                      <div style={{ fontSize: 12, marginTop: 4, display: 'flex', gap: 12 }}>
                        <span style={{ color: 'var(--accent-green)' }}>In: {new Date(log.checkedInAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        {log.checkedOutAt ? (
                          <span style={{ color: 'var(--accent-red)' }}>Out: {new Date(log.checkedOutAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                        ) : (
                          <span className="badge badge-orange" style={{ fontSize: 10, padding: '2px 6px' }}>Đang tập</span>
                        )}
                      </div>
                      {log.notes && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, fontStyle: 'italic' }}>
                          Ghi chú: {log.notes}
                        </div>
                      )}
                    </div>
                    {!log.checkedOutAt && (
                      <button className="btn btn-primary btn-sm" onClick={() => { setCheckoutTarget(log); setCheckoutNotes(log.notes || ''); }} style={{ padding: '6px 12px', fontSize: 12 }}>
                        <LogOut size={12} /> Out
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Notes Modal */}
      {checkoutTarget && (
        <div className="modal-overlay" onClick={() => setCheckoutTarget(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <div className="modal-header">
              <span className="modal-title">Ghi chú & Check-out</span>
              <button className="btn btn-ghost btn-icon" onClick={() => setCheckoutTarget(null)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{checkoutTarget.member?.user?.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{checkoutTarget.member?.memberCode}</div>
              </div>
              <div className="form-group">
                <label className="form-label">Ghi chú buổi tập (không bắt buộc)</label>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  placeholder="Ví dụ: Tập ngực tốt, chạy bộ 15p..." 
                  value={checkoutNotes}
                  onChange={e => setCheckoutNotes(e.target.value)}
                  style={{ width: '100%', resize: 'vertical', minHeight: 80, padding: 10 }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setCheckoutTarget(null)}>Hủy</button>
              <button 
                className="btn btn-primary" 
                onClick={() => checkout.mutate({ id: checkoutTarget.id, notes: checkoutNotes })}
                disabled={checkout.isPending}
              >
                {checkout.isPending ? 'Đang xử lý...' : 'Xác nhận & Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
