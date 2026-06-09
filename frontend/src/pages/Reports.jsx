import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';

const fmtCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function Reports() {
  const [from, setFrom] = useState(() => {
    const d = new Date(); d.setDate(1);
    return d.toISOString().split('T')[0];
  });
  const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: revenue, isLoading: loadRev, refetch } = useQuery({
    queryKey: ['revenue', from, to],
    queryFn: () => api.get(`/reports/revenue?from=${from}&to=${to}`).then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['members-summary'],
    queryFn: () => api.get('/reports/members-summary').then(r => r.data),
  });

  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(r => r.data),
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Báo cáo & Thống kê</h1>
        <p className="page-subtitle">Tổng hợp hoạt động kinh doanh của phòng gym</p>
      </div>
      <div className="page-body">
        {/* KPI row */}
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card" style={{ '--card-color': '#00d4ff', '--card-color-dim': 'rgba(0,212,255,0.12)' }}>
            <div className="stat-card-icon">👥</div>
            <div className="stat-card-label">Tổng hội viên</div>
            <div className="stat-card-value">{summary?.totalMembers ?? '...'}</div>
            <div className="stat-card-sub">+{summary?.newThisMonth ?? 0} tháng này</div>
          </div>
          <div className="stat-card" style={{ '--card-color': '#22c55e', '--card-color-dim': 'rgba(34,197,94,0.12)' }}>
            <div className="stat-card-icon">✅</div>
            <div className="stat-card-label">Gói đang active</div>
            <div className="stat-card-value">{summary?.activeSubscriptions ?? '...'}</div>
          </div>
          <div className="stat-card" style={{ '--card-color': '#f59e0b', '--card-color-dim': 'rgba(245,158,11,0.12)' }}>
            <div className="stat-card-icon">💰</div>
            <div className="stat-card-label">Doanh thu tháng này</div>
            <div className="stat-card-value">{dash ? (dash.monthlyRevenue / 1e6).toFixed(1) + 'M' : '...'}</div>
            <div className="stat-card-sub">VNĐ</div>
          </div>
          <div className="stat-card" style={{ '--card-color': '#f05a28', '--card-color-dim': 'rgba(240,90,40,0.12)' }}>
            <div className="stat-card-icon">🏃</div>
            <div className="stat-card-label">Check-in hôm nay</div>
            <div className="stat-card-value">{dash?.todayCheckIns ?? '...'}</div>
          </div>
        </div>

        {/* Revenue filter */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">📊 Báo cáo doanh thu</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Từ ngày</label>
              <input className="form-input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Đến ngày</label>
              <input className="form-input" type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={() => refetch()}>Xem báo cáo</button>
          </div>

          {loadRev ? (
            <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
          ) : revenue ? (
            <div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>TỔNG DOANH THU</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--success)' }}>{fmtCurrency(revenue.total)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>SỐ ĐƠN</div>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{revenue.count}</div>
                </div>
              </div>

              <div className="card-title">Doanh thu theo gói tập</div>
              {Object.keys(revenue.byPackage || {}).length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Không có dữ liệu trong khoảng thời gian này</div>
              ) : (
                Object.entries(revenue.byPackage).map(([name, val]) => {
                  const max = Math.max(...Object.values(revenue.byPackage));
                  return (
                    <div className="chart-bar-row" key={name}>
                      <div className="chart-label">{name}</div>
                      <div className="chart-bar-bg">
                        <div className="chart-bar-fill" style={{ width: `${(val / max) * 100}%` }} />
                      </div>
                      <div className="chart-value">{fmtCurrency(val)}</div>
                    </div>
                  );
                })
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
