import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star, Send } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const TARGET_OPTIONS = [
  { value: 'staff',    label: 'Nhân viên quản lý' },
  { value: 'pt',       label: 'Huấn luyện viên' },
  { value: 'facility', label: 'Cơ sở vật chất' },
];

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:'flex', gap:6 }}>
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
          style={{ background:'none', border:'none', cursor:'pointer', padding:2 }}>
          <Star size={28} fill={(hover||value)>=i ? '#f59e0b' : 'none'} stroke={(hover||value)>=i ? '#f59e0b' : 'var(--text-muted)'}
            style={{ transition:'all 0.15s' }}/>
        </button>
      ))}
    </div>
  );
}

const LABEL = ['','Rất tệ','Tệ','Bình thường','Tốt','Xuất sắc'];

export default function MemberFeedback() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [form, setForm] = useState({ targetType:'staff', targetId:'', rating:0, comment:'' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: myFeedbacks = [] } = useQuery({
    queryKey: ['my-feedbacks'],
    queryFn: () => api.get('/feedbacks/mine').then(r => r.data).catch(() => []),
  });

  const submit = useMutation({
    mutationFn: (data) => api.post('/feedbacks', data),
    onSuccess: () => {
      setSuccess(true);
      setForm({ targetType:'staff', targetId:'', rating:0, comment:'' });
      qc.invalidateQueries(['my-feedbacks']);
      setTimeout(() => setSuccess(false), 4000);
    },
    onError: (e) => setError(e.response?.data?.error || 'Lỗi gửi phản hồi'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.rating) { setError('Vui lòng chọn số sao đánh giá'); return; }
    submit.mutate({ ...form, targetId: form.targetId || null });
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Gửi phản hồi</h1>
        <p className="page-subtitle">Đánh giá chất lượng dịch vụ để giúp chúng tôi cải thiện</p>
      </div>

      <div className="page-body">
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div className="table-wrap" style={{ padding:'28px 28px 24px' }}>
            <h2 style={{ fontSize:17, fontWeight:600, marginBottom:20 }}>Đánh giá dịch vụ</h2>
            {success && (
              <div className="alert" style={{ background:'rgba(34,197,94,0.12)', color:'var(--accent-green, #22c55e)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:8, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
                ✅ Cảm ơn bạn đã gửi phản hồi!
              </div>
            )}
            {error && <div className="alert alert-error" style={{ marginBottom:16 }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom:16 }}>
                <label className="form-label">Đánh giá về</label>
                <select className="form-input" value={form.targetType} onChange={e => setForm(f=>({...f,targetType:e.target.value}))}>
                  {TARGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom:20 }}>
                <label className="form-label">Mức độ hài lòng *</label>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:8 }}>
                  <StarPicker value={form.rating} onChange={r => setForm(f=>({...f,rating:r}))}/>
                  {form.rating > 0 && (
                    <span style={{ fontSize:14, fontWeight:500, color:'#f59e0b' }}>{LABEL[form.rating]}</span>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom:20 }}>
                <label className="form-label">Nhận xét (tùy chọn)</label>
                <textarea className="form-input" rows={4} placeholder="Chia sẻ trải nghiệm của bạn..."
                  style={{ resize:'vertical', minHeight:100 }}
                  value={form.comment} onChange={e => setForm(f=>({...f,comment:e.target.value}))}/>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width:'100%', justifyContent:'center', gap:8, padding:'12px' }} disabled={submit.isPending}>
                <Send size={16}/> {submit.isPending ? 'Đang gửi...' : 'Gửi phản hồi'}
              </button>
            </form>
          </div>

          {/* My feedback history */}
          {myFeedbacks.length > 0 && (
            <div className="table-wrap" style={{ marginTop:20 }}>
              <div className="table-header"><span className="table-title">Phản hồi đã gửi</span></div>
              {myFeedbacks.map(f => (
                <div key={f.id} style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:500 }}>{TARGET_OPTIONS.find(o=>o.value===f.targetType)?.label||f.targetType}</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(f.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div style={{ display:'flex', gap:2, marginBottom:6 }}>
                    {[1,2,3,4,5].map(i=><Star key={i} size={12} fill={i<=f.rating?'#f59e0b':'none'} stroke={i<=f.rating?'#f59e0b':'var(--text-muted)'}/>)}
                  </div>
                  {f.comment && <div style={{ fontSize:13, color:'var(--text-secondary)' }}>{f.comment}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
