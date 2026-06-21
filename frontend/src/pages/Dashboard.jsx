import { useQuery } from '@tanstack/react-query';
import {
  Users, CheckCircle, TrendingUp, DollarSign,
  Wrench, UserPlus, ClipboardList, BarChart2, Activity
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const fmt = (n) => new Intl.NumberFormat('vi-VN').format(n);
const fmtCurrency = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

function StatCard({ icon: Icon, label, value, sub, color, colorDim }) {
  return (
    <div className="stat-card" style={{ '--card-color': color, '--card-color-dim': colorDim }}>
      <div className="stat-card-icon" style={{ color }}>
        <Icon size={22} />
      </div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, to, color }) {
  return (
    <a href={to} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 14px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 8, fontSize: 13,
      color: 'var(--text-primary)',
      transition: 'all 0.2s', cursor: 'pointer',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = 'var(--bg-hover)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}
    >
      <Icon size={16} style={{ color, flexShrink: 0 }} />
      <span>{label}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12 }}>→</span>
    </a>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/reports/dashboard').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['revenue-month'],
    queryFn: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split('T')[0];
      return api.get(`/reports/revenue?from=${from}`).then(r => r.data);
    },
    enabled: user?.role === 'owner',
  });

  const { data: memberSummary } = useQuery({
    queryKey: ['members-summary'],
    queryFn: () => api.get('/reports/members-summary').then(r => r.data),
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Chào mừng trở lại, <strong>{user?.name}</strong> —{' '}
          {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
      </div>

      <div className="page-body">
        {isLoading ? (
          <div className="loading-spinner"><div className="spinner" /> Đang tải...</div>
        ) : (
          <div className="stats-grid">
            <StatCard
              icon={Users} label="Tổng hội viên"
              value={fmt(stats?.totalMembers ?? 0)}
              sub={`+${memberSummary?.newThisMonth ?? 0} tháng này`}
              color="#00d4ff" colorDim="rgba(0,212,255,0.12)"
            />
            <StatCard
              icon={CheckCircle} label="Gói đang active"
              value={fmt(stats?.activeSubscriptions ?? 0)}
              color="#22c55e" colorDim="rgba(34,197,94,0.12)"
            />
            <StatCard
              icon={Activity} label="Check-in hôm nay"
              value={fmt(stats?.todayCheckIns ?? 0)}
              color="#f05a28" colorDim="rgba(240,90,40,0.12)"
            />
            {user?.role === 'owner' && (
              <StatCard
                icon={DollarSign} label="Doanh thu tháng này"
                value={fmtCurrency(stats?.monthlyRevenue ?? 0)}
                color="#f59e0b" colorDim="rgba(245,158,11,0.12)"
              />
            )}
            {(stats?.pendingMaintenance ?? 0) > 0 && (
              <StatCard
                icon={Wrench} label="Bảo trì chờ xử lý"
                value={stats.pendingMaintenance}
                sub="Cần xử lý sớm"
                color="#ef4444" colorDim="rgba(239,68,68,0.12)"
              />
            )}
          </div>
        )}

        <div className="two-col" style={{ gap: 20 }}>
          {/* Revenue chart */}
          {user?.role === 'owner' && revenueData && (
            <div className="card">
              <div className="card-title">
                <TrendingUp size={15} />
                Doanh thu theo gói tập
              </div>
              {Object.keys(revenueData.byPackage || {}).length === 0 ? (
                <div className="empty-state" style={{ padding: 20 }}>
                  <BarChart2 size={36} style={{ opacity: 0.3 }} />
                  <div className="empty-state-text">Chưa có dữ liệu</div>
                </div>
              ) : (
                <>
                  {Object.entries(revenueData.byPackage).map(([name, val]) => {
                    const max = Math.max(...Object.values(revenueData.byPackage));
                    return (
                      <div className="chart-bar-row" key={name}>
                        <div className="chart-label">{name}</div>
                        <div className="chart-bar-bg">
                          <div className="chart-bar-fill" style={{ width: `${(val / max) * 100}%` }} />
                        </div>
                        <div className="chart-value">{(val / 1e6).toFixed(1)}M</div>
                      </div>
                    );
                  })}
                  <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
                    Tổng:{' '}
                    <strong style={{ color: 'var(--primary)' }}>
                      {fmtCurrency(revenueData.total)}
                    </strong>
                    <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>
                      ({revenueData.count} đơn)
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick actions */}
          <div className="card">
            <div className="card-title">
              <ClipboardList size={15} />
              Thao tác nhanh
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(user?.role === 'owner' || user?.role === 'staff') && (
                <>
                  <QuickAction icon={UserPlus}     label="Thêm hội viên mới"        to="/members"       color="var(--accent)" />
                  <QuickAction icon={ClipboardList} label="Đăng ký gói tập"          to="/subscriptions" color="var(--success)" />
                  <QuickAction icon={CheckCircle}  label="Check-in hội viên"         to="/checkin"       color="var(--primary)" />
                </>
              )}
              {user?.role === 'pt' && (
                <>
                  <QuickAction icon={CheckCircle} label="Check-in hội viên" to="/checkin"       color="var(--primary)" />
                  <QuickAction icon={Users}       label="Danh sách hội viên" to="/members"       color="var(--accent)" />
                </>
              )}
              {user?.role === 'owner' && (
                <QuickAction icon={BarChart2} label="Xem báo cáo doanh thu" to="/reports" color="var(--warning)" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
