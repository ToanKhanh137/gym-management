import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Ticket, ClipboardList, Home,
  Dumbbell, UserCog, BarChart2, MessageSquare, CheckSquare,
  Calendar, User, LogOut, Wrench, Star
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
  ],
  pt: [
    { label: 'Dashboard',         icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Hội viên',          icon: Users,           to: '/members' },
    { label: 'Check-in',          icon: CheckSquare,     to: '/checkin' },
    { label: 'Lịch tập',          icon: Calendar,        to: '/training-logs' },
  ],
  member: [
    { label: 'Hồ sơ',             icon: User,            to: '/profile' },
    { label: 'Gói tập',           icon: Ticket,          to: '/my-subscription' },
    { label: 'Lịch sử tập',       icon: Calendar,        to: '/my-training' },
    { label: 'Phản hồi',          icon: Star,            to: '/feedback' },
  ],
};

const ROLE_LABELS = {
  owner: 'Chủ phòng tập',
  staff: 'Nhân viên',
  pt: 'Huấn luyện viên',
  member: 'Hội viên',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = NAV[user?.role] || [];
  const initials = user?.name?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Dumbbell size={18} color="white" />
          </div>
          <div>
            <div className="sidebar-logo-text">GymPro</div>
            <div className="sidebar-logo-sub">Management</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon size={16} className="nav-item-icon" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div style={{ minWidth: 0 }}>
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

      <main className="main-content">{children}</main>
    </div>
  );
}
