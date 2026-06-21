import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Save } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const DAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

export default function StaffSchedule() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [draftSchedule, setDraftSchedule] = useState(null);

  const { data: staffUsers = [] } = useQuery({
    queryKey: ['staff-users'],
    queryFn: () => api.get('/users').then((r) => r.data.filter((item) => item.role === 'staff')),
    enabled: user?.role === 'owner',
  });

  const effectiveUserId = selectedUserId || (staffUsers[0]?.id ? String(staffUsers[0].id) : '');

  const scheduleUrl = user?.role === 'owner' && effectiveUserId
    ? `/staff-schedules?userId=${effectiveUserId}`
    : '/staff-schedules';

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['staff-schedules', effectiveUserId || 'mine'],
    queryFn: () => api.get(scheduleUrl).then((r) => r.data),
    enabled: user?.role === 'staff' || Boolean(effectiveUserId),
  });

  const serverSchedule = useMemo(() => {
    const next = {};
    schedules.forEach((item) => {
      next[item.dayOfWeek] = {
        active: true,
        startTime: item.startTime,
        endTime: item.endTime,
      };
    });
    return next;
  }, [schedules]);
  const schedule = draftSchedule || serverSchedule;

  const saveSchedule = useMutation({
    mutationFn: (payload) => api.put(`/staff-schedules/${effectiveUserId}`, { schedules: payload }),
    onSuccess: () => {
      setDraftSchedule(null);
      qc.invalidateQueries({ queryKey: ['staff-schedules'] });
    },
  });

  const rows = useMemo(() => DAYS.map((name, dayOfWeek) => ({
    name,
    dayOfWeek,
    active: Boolean(schedule[dayOfWeek]?.active),
    startTime: schedule[dayOfWeek]?.startTime || '08:00',
    endTime: schedule[dayOfWeek]?.endTime || '17:00',
  })), [schedule]);

  const updateDay = (dayOfWeek, patch) => {
    setDraftSchedule((currentDraft) => {
      const current = currentDraft || serverSchedule;
      return {
      ...current,
      [dayOfWeek]: {
        active: current[dayOfWeek]?.active || false,
        startTime: current[dayOfWeek]?.startTime || '08:00',
        endTime: current[dayOfWeek]?.endTime || '17:00',
        ...patch,
      },
      };
    });
  };

  const handleSave = () => {
    const payload = rows
      .filter((row) => row.active)
      .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));
    saveSchedule.mutate(payload);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Lịch làm việc nhân viên</h1>
        <p className="page-subtitle">
          {user?.role === 'owner' ? 'Phân công ca làm việc theo tuần' : 'Lịch làm việc trong tuần của bạn'}
        </p>
      </div>
      <div className="page-body">
        <div className="card" style={{ maxWidth: 760 }}>
          {user?.role === 'owner' && (
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Nhân viên</label>
              <select
                className="form-input"
                value={effectiveUserId}
                onChange={(event) => { setSelectedUserId(event.target.value); setDraftSchedule(null); }}
              >
                {staffUsers.map((staff) => (
                  <option key={staff.id} value={staff.id}>{staff.name} - {staff.email}</option>
                ))}
              </select>
            </div>
          )}

          {isLoading ? (
            <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {rows.map((row) => (
                <div
                  key={row.dayOfWeek}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 90px 1fr 1fr',
                    gap: 12,
                    alignItems: 'center',
                    padding: 12,
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    background: row.active ? 'var(--bg-secondary)' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <Calendar size={15} /> {row.name}
                  </div>
                  {user?.role === 'owner' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <input
                        type="checkbox"
                        checked={row.active}
                        onChange={() => updateDay(row.dayOfWeek, { active: !row.active })}
                      />
                      Làm
                    </label>
                  ) : (
                    <span className={`badge ${row.active ? 'badge-green' : 'badge-gray'}`}>
                      {row.active ? 'Có ca' : 'Nghỉ'}
                    </span>
                  )}
                  <input
                    className="form-input"
                    type="time"
                    disabled={!row.active || user?.role !== 'owner'}
                    value={row.startTime}
                    onChange={(event) => updateDay(row.dayOfWeek, { startTime: event.target.value })}
                  />
                  <input
                    className="form-input"
                    type="time"
                    disabled={!row.active || user?.role !== 'owner'}
                    value={row.endTime}
                    onChange={(event) => updateDay(row.dayOfWeek, { endTime: event.target.value })}
                  />
                </div>
              ))}
            </div>
          )}

          {user?.role === 'owner' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saveSchedule.isPending}>
                <Save size={15} /> {saveSchedule.isPending ? 'Đang lưu...' : 'Lưu lịch'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
