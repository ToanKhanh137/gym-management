import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Ticket, ClipboardList, Home,
  Dumbbell, UserCog, BarChart2, MessageSquare, CheckSquare,
  Calendar, User, LogOut, Wrench, Star, Menu, X, Gift
} from 'lucide-react';

const NAV = {
  owner: [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Hội viên',          icon: Users,           to: '/members' },
    { label: 'Gói tập',           icon: Ticket,          to: '/packages' },
    { label: 'Đăng ký / Gia hạn', icon: ClipboardList,   to: '/subscriptions' },
    { label: 'Phòng tập',         icon: Home,            to: '/rooms' },
    { label: 'Thiết bị',          icon: Dumbbell,        to: '/equipment' },
    { label: 'Nhân sự',           icon: UserCog,         to: '/users' },
    { label: 'Lịch nhân viên',    icon: Calendar,        to: '/staff-schedule' },
    { label: 'Khuyến mãi',        icon: Gift,            to: '/promotions' },
    { label: 'Báo cáo',           icon: BarChart2,       to: '/reports' },
    { label: 'Phản hồi',          icon: MessageSquare,   to: '/feedbacks' },
  ],
  staff: [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Hội viên',          icon: Users,           to: '/members' },
    { label: 'Check-in',          icon: CheckSquare,     to: '/checkin' },
    { label: 'Đăng ký / Gia hạn', icon: ClipboardList,   to: '/subscriptions' },
    { label: 'Phòng tập',         icon: Home,            to: '/rooms' },
    { label: 'Thiết bị',          icon: Dumbbell,        to: '/equipment' },
    { label: 'Bảo trì',           icon: Wrench,          to: '/maintenance' },
    { label: 'Phản hồi',          icon: MessageSquare,   to: '/feedbacks' },
    { label: 'Lịch làm việc',     icon: Calendar,        to: '/staff-schedule' },
    { label: 'Khuyến mãi',        icon: Gift,            to: '/promotions' },
  ],
  pt: [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Học viên',          icon: Users,           to: '/trainer-students' },
    { label: 'Lịch làm việc',     icon: Calendar,        to: '/trainer-schedule' },
    { label: 'Check-in',          icon: CheckSquare,     to: '/checkin' },
  ],
  member: [
    { label: 'Hồ sơ',             icon: User,            to: '/profile' },
    { label: 'Gói tập',           icon: Ticket,          to: '/my-subscription' },
    { label: 'Lịch sử tập',       icon: Calendar,        to: '/my-training' },
    { label: 'Phản hồi',          icon: Star,            to: '/feedback' },
    { label: 'Khuyến mãi',        icon: Gift,            to: '/promotions' },
  ],
};

const ROLE_LABELS = {
  owner: 'Chủ phòng tập',
  staff: 'Nhân viên',
  pt: 'Huấn luyện viên',
  member: 'Hội viên',
};

const SHORT_LABELS = {
  'Dashboard': 'Dashboard',
  'Hội viên': 'Hội viên',
  'Gói tập': 'Gói tập',
  'Đăng ký / Gia hạn': 'Đăng ký',
  'Phòng tập': 'Phòng tập',
  'Thiết bị': 'Thiết bị',
  'Nhân sự': 'Nhân sự',
  'Lịch nhân viên': 'Lịch làm',
  'Khuyến mãi': 'Khuyến mãi',
  'Báo cáo': 'Báo cáo',
  'Phản hồi': 'Phản hồi',
  'Bảo trì': 'Bảo trì',
  'Lịch làm việc': 'Lịch làm',
  'Check-in': 'Check-in',
  'Học viên': 'Học viên',
  'Hồ sơ': 'Hồ sơ',
  'Lịch sử tập': 'Lịch sử',
};

// Bottom nav shows only the most important items (max 5)
const BOTTOM_NAV = {
  owner:  ['dashboard', 'members', 'checkin', 'reports'],
  staff:  ['dashboard', 'members', 'checkin', 'equipment'],
  pt:     ['dashboard', 'trainer-students', 'trainer-schedule', 'checkin'],
  member: ['profile', 'my-subscription', 'my-training', 'feedback'],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = NAV[user?.role] || [];
  const bottomKeys = BOTTOM_NAV[user?.role] || [];
  const bottomItems = navItems.filter(item =>
    bottomKeys.some(k => item.to.includes(k))
  );

  const initials = user?.name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';
  const handleLogout = () => { logout(); navigate('/login'); };
  const closeSidebar = () => setSidebarOpen(false);
  const handleLogoClick = () => {
    if (user?.role === 'member') {
      navigate('/profile');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="sidebar-logo-icon">
            <Dumbbell size={18} color="white" />
          </div>
          <div>
            <div className="sidebar-logo-text">GymPro</div>
            <div className="sidebar-logo-sub">Management</div>
          </div>
          {/* Close button — mobile only */}
          <button
            className="mobile-menu-btn"
            onClick={closeSidebar}
            style={{ marginLeft: 'auto', display: 'none' }}
            id="sidebar-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={closeSidebar}
              >
                <Icon size={16} className="nav-item-icon" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="sidebar-user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div className="sidebar-user-role">{ROLE_LABELS[user?.role]}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Đăng xuất">
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* Overlay — closes sidebar on mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* Main content */}
      <main className="main-content">
        {/* Mobile top header */}
        <header className="mobile-header">
          <div className="mobile-header-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <div className="mobile-header-logo-icon">
              <Dumbbell size={16} color="white" />
            </div>
            GymPro
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.name}</div>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
          </div>
        </header>

        {children}
      </main>

      {/* Bottom navigation — mobile only */}
      <nav className="bottom-nav">
        <div className="bottom-nav-items">
          {bottomItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`bottom-nav-item${isActive ? ' active' : ''}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{SHORT_LABELS[item.label] || item.label}</span>
              </NavLink>
            );
          })}
          {/* Always show logout at end */}
          <button className="bottom-nav-item" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} strokeWidth={1.8} />
            <span>Thoát</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
