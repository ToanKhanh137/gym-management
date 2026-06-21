import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, CheckCircle2, DollarSign, Activity, Star, TrendingUp, Download } from 'lucide-react';
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

  const { data: registrationReport, refetch: refetchRegistrations } = useQuery({
    queryKey: ['registration-report', from, to],
    queryFn: () => api.get(`/reports/registrations?from=${from}&to=${to}`).then(r => r.data),
  });

  const { data: summary } = useQuery({
    queryKey: ['members-summary'],
    queryFn: () => api.get('/reports/members-summary').then(r => r.data),
  });

  const { data: dash } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(r => r.data),
  });

  const { data: performance } = useQuery({
    queryKey: ['performance'],
    queryFn: () => api.get('/reports/performance').then(r => r.data),
  });

  const handleExportCSV = () => {
    if (!revenue || !revenue.transactions || revenue.transactions.length === 0) {
      alert('Không có dữ liệu giao dịch để xuất báo cáo!');
      return;
    }

    const payLabels = { cash: 'Tiền mặt', bank_transfer: 'Chuyển khoản', e_wallet: 'Ví điện tử' };

    // CSV headers
    const headers = ['Mã giao dịch', 'Loại giao dịch', 'Ngày thanh toán', 'Hội viên', 'Gói tập', 'Số tiền (VNĐ)', 'Phương thức thanh toán'];
    
    // Convert transaction rows
    const rows = revenue.transactions.map(t => [
      t.id,
      t.type,
      t.date,
      t.memberName,
      t.packageName,
      t.amountPaid,
      payLabels[t.paymentMethod] || t.paymentMethod
    ]);

    // Summary section
    const summaryRows = [
      [],
      ['TỔNG HỢP BÁO CÁO DOANH THU'],
      ['Khoảng thời gian', `${from} đến ${to}`],
      ['Tổng doanh thu', `${revenue.total} VNĐ`],
      ['Tổng số lượng giao dịch', revenue.count],
      [],
      ['Doanh thu chi tiết theo gói tập:'],
    ];

    Object.entries(revenue.byPackage || {}).forEach(([pkgName, pkgValue]) => {
      summaryRows.push([pkgName, `${pkgValue} VNĐ`]);
    });

    // Combine headers, rows and summary
    const allRows = [headers, ...rows, ...summaryRows];

    // Build CSV string with BOM
    const csvContent = '\uFEFF' + allRows.map(e => e.map(val => {
      // Escape double quotes and wrap in quotes if value contains commas or quotes
      let cleanVal = String(val).replace(/"/g, '""');
      if (cleanVal.includes(',') || cleanVal.includes('\n') || cleanVal.includes('"')) {
        cleanVal = `"${cleanVal}"`;
      }
      return cleanVal;
    }).join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bao_cao_doanh_thu_${from}_den_${to}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <div className="stat-card-icon" style={{ color: '#00d4ff' }}><Users size={22} /></div>
            <div className="stat-card-label">Tổng hội viên</div>
            <div className="stat-card-value">{summary?.totalMembers ?? '...'}</div>
            <div className="stat-card-sub">+{summary?.newThisMonth ?? 0} tháng này</div>
          </div>
          <div className="stat-card" style={{ '--card-color': '#22c55e', '--card-color-dim': 'rgba(34,197,94,0.12)' }}>
            <div className="stat-card-icon" style={{ color: '#22c55e' }}><CheckCircle2 size={22} /></div>
            <div className="stat-card-label">Gói đang active</div>
            <div className="stat-card-value">{summary?.activeSubscriptions ?? '...'}</div>
          </div>
          <div className="stat-card" style={{ '--card-color': '#f59e0b', '--card-color-dim': 'rgba(245,158,11,0.12)' }}>
            <div className="stat-card-icon" style={{ color: '#f59e0b' }}><DollarSign size={22} /></div>
            <div className="stat-card-label">Doanh thu tháng này</div>
            <div className="stat-card-value">{dash ? (dash.monthlyRevenue / 1e6).toFixed(1) + 'M' : '...'}</div>
            <div className="stat-card-sub">VNĐ</div>
          </div>
          <div className="stat-card" style={{ '--card-color': '#f05a28', '--card-color-dim': 'rgba(240,90,40,0.12)' }}>
            <div className="stat-card-icon" style={{ color: '#f05a28' }}><Activity size={22} /></div>
            <div className="stat-card-label">Check-in hôm nay</div>
            <div className="stat-card-value">{dash?.todayCheckIns ?? '...'}</div>
          </div>
        </div>

        {/* Revenue filter */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title"><TrendingUp size={15} /> Báo cáo doanh thu</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 20 }}>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Từ ngày</label>
              <input className="form-input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 150 }}>
              <label className="form-label">Đến ngày</label>
              <input className="form-input" type="date" value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={() => { refetch(); refetchRegistrations(); }}>Xem báo cáo</button>
            {revenue && revenue.transactions && revenue.transactions.length > 0 && (
              <button className="btn btn-ghost" onClick={handleExportCSV} style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid var(--border)' }}>
                <Download size={14} /> Xuất Excel
              </button>
            )}
          </div>

          <div className="stats-grid" style={{ marginBottom: 22 }}>
            <div className="stat-card">
              <div className="stat-card-label">Hội viên mới</div>
              <div className="stat-card-value">{registrationReport?.newMembers ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Đăng ký mới</div>
              <div className="stat-card-value">{registrationReport?.registrations ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Lượt gia hạn</div>
              <div className="stat-card-value">{registrationReport?.renewals ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-label">Buổi đã sử dụng</div>
              <div className="stat-card-value">{registrationReport?.sessionsUsed ?? 0}</div>
            </div>
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

        {/* Performance Report */}
        <div className="card">
          <div className="card-title"><Star size={15} /> Báo cáo Hiệu suất Nhân sự (Staff / PT)</div>
          <div className="table-wrap" style={{ marginTop: 16 }}>
            <div className="mobile-hide-table">
              <table>
                <thead>
                  <tr>
                    <th>Nhân sự</th>
                    <th>Vai trò</th>
                    <th>Rating trung bình</th>
                    <th>Số lượt đánh giá</th>
                    <th>HĐ / Học viên phụ trách</th>
                  </tr>
                </thead>
                <tbody>
                  {performance?.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.name} {!p.isActive && <span className="badge badge-gray" style={{ marginLeft: 8 }}>Nghỉ việc</span>}</td>
                      <td>{p.role === 'pt' ? 'Huấn luyện viên' : 'Nhân viên'}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                          <strong>{p.avgRating}</strong>
                        </div>
                      </td>
                      <td>{p.feedbacksCount} lượt</td>
                      <td>{p.handledCount} {p.role === 'pt' ? 'học viên' : 'hợp đồng'}</td>
                    </tr>
                  ))}
                  {!performance?.length && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>Chưa có dữ liệu</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mobile-only-cards" style={{ padding: '8px 0' }}>
              {performance?.map(p => (
                <div key={p.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {p.name}
                      {!p.isActive && <span className="badge badge-gray" style={{ fontSize: 9, marginLeft: 6, padding: '1px 4px' }}>Nghỉ</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {p.role === 'pt' ? 'Huấn luyện viên' : 'Nhân viên'} | {p.handledCount} {p.role === 'pt' ? 'học viên' : 'hợp đồng'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                      <Star size={13} fill="#f59e0b" stroke="#f59e0b" />
                      <strong style={{ fontSize: 14 }}>{p.avgRating}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{p.feedbacksCount} đánh giá</div>
                  </div>
                </div>
              ))}
              {!performance?.length && (
                <div className="empty-state" style={{ padding: '20px' }}>Chưa có dữ liệu</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
