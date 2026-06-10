import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Save } from 'lucide-react';
import api from '../api/client';

const DAYS = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export default function TrainerSchedule() {
  const qc = useQueryClient();
  const [schedule, setSchedule] = useState({});

  const { data = [], isLoading } = useQuery({
    queryKey: ['trainer-schedule'],
    queryFn: () => api.get('/trainers/mine/schedule').then(r => r.data),
  });

  useEffect(() => {
    if (data) {
      const formatted = {};
      data.forEach(s => {
        formatted[s.dayOfWeek] = { startTime: s.startTime, endTime: s.endTime, active: true };
      });
      setSchedule(formatted);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload) => api.put('/trainers/mine/schedule', { schedules: payload }),
    onSuccess: () => {
      qc.invalidateQueries(['trainer-schedule']);
      alert('Lưu lịch thành công!');
    },
    onError: () => alert('Lỗi khi lưu lịch')
  });

  const handleSave = () => {
    const payload = [];
    Object.keys(schedule).forEach(day => {
      if (schedule[day].active && schedule[day].startTime && schedule[day].endTime) {
        payload.push({
          dayOfWeek: parseInt(day),
          startTime: schedule[day].startTime,
          endTime: schedule[day].endTime
        });
      }
    });
    updateMutation.mutate(payload);
  };

  const handleToggle = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day]?.active, startTime: prev[day]?.startTime || '08:00', endTime: prev[day]?.endTime || '17:00' }
    }));
  };

  const handleChange = (day, field, val) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: val }
    }));
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Lịch làm việc</h1>
        <p className="page-subtitle">Cập nhật lịch đăng ký làm việc của bạn trong tuần</p>
      </div>

      <div className="page-body">
        <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={20} color="var(--accent-blue)" />
            <h2 className="card-title">Khung giờ làm việc</h2>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="loading-spinner"><div className="spinner"/> Đang tải...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {DAYS.map((dayName, idx) => {
                  const isActive = schedule[idx]?.active;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px', background: isActive ? 'var(--bg-secondary)' : 'transparent', border: '1px solid var(--border)', borderRadius: 8 }}>
                      <div style={{ width: 100 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600 }}>
                          <input type="checkbox" checked={!!isActive} onChange={() => handleToggle(idx)} />
                          {dayName}
                        </label>
                      </div>
                      
                      {isActive ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                          <input 
                            type="time" 
                            className="form-input" 
                            style={{ flex: 1 }}
                            value={schedule[idx]?.startTime || ''} 
                            onChange={e => handleChange(idx, 'startTime', e.target.value)} 
                          />
                          <span style={{ color: 'var(--text-muted)' }}>-</span>
                          <input 
                            type="time" 
                            className="form-input" 
                            style={{ flex: 1 }}
                            value={schedule[idx]?.endTime || ''} 
                            onChange={e => handleChange(idx, 'endTime', e.target.value)} 
                          />
                        </div>
                      ) : (
                        <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>
                          Nghỉ
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={updateMutation.isPending}>
                <Save size={16} /> {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
