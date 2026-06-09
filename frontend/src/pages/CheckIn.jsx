import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserCheck, LogOut, Users } from 'lucide-react';
import api from '../api/client';

export default function CheckIn() {
  const qc = useQueryClient();
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedSub, setSelectedSub] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
      refetchLogs();
      setTimeout(() => setSuccess(''), 3000);
    },
    onError: (e) => setError(e.response?.data?.error || 'Check-in thất bại'),
  });

  const checkout = useMutation({
    mutationFn: (logId) => api.patch(`/training-logs/${logId}/checkout`),
    onSuccess: () => refetchLogs(),
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
    checkin.mutate({ memberId: selectedMember.id, subscriptionId: parseInt(selectedSub) });
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
                      {log.checkedOutAt
                        ? new Date(log.checkedOutAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        : <span className="badge badge-orange">Đang tập</span>}
                    </td>
                    <td>
                      {!log.checkedOutAt && (
                        <button className="btn btn-ghost btn-sm" onClick={() => checkout.mutate(log.id)}>
                          <LogOut size={13} /> Out
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
    </>
  );
}
