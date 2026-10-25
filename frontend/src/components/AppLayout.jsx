import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronLeft,
  ClipboardCheck,
  Compass,
  GraduationCap,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

const studentLinks = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/assessment", label: "Assessment", icon: ClipboardCheck },
  {
    to: "/app/recommendations/latest",
    label: "Recommendations",
    icon: Sparkles,
  },
  { to: "/app/careers", label: "Explore careers", icon: BriefcaseBusiness },
  { to: "/app/roadmap", label: "My roadmap", icon: BookOpen },
  { to: "/app/progress", label: "Progress", icon: ChartNoAxesCombined },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/profile", label: "My profile", icon: UserRound },
];

const adminLinks = [
  { to: "/admin", label: "Admin overview", icon: ShieldCheck },
  { to: "/admin/careers", label: "Manage careers", icon: BriefcaseBusiness },
  { to: "/admin/resources", label: "Manage resources", icon: BookOpen },
  { to: "/admin/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { to: "/admin/audit-logs", label: "Audit logs", icon: Activity },
];

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/admin"}
      onClick={onNavigate}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
    >
      <Icon size={18} strokeWidth={1.9} />
      <span>{item.label}</span>
    </NavLink>
  );
}

export default function AppLayout({ admin = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const links = admin ? adminLinks : studentLinks;

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function demoLogout() {
    sessionStorage.removeItem("careerNavigatorToken");
    sessionStorage.removeItem("careerNavigatorUser");
    navigate("/", { replace: true });
  }
  const savedUser = JSON.parse(
    sessionStorage.getItem("careerNavigatorUser") || "{}"
  );

  const displayName = savedUser.name || "Student";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`sidebar${mobileOpen ? " sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Compass size={23} />
          </div>
          <div>
            <strong>Career Navigator</strong>
            <span>Find your direction</span>
          </div>
          <button
            className="icon-button sidebar-close"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">
          {admin ? "ADMIN WORKSPACE" : "STUDENT WORKSPACE"}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {links.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              onNavigate={closeMobileMenu}
            />
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <Sparkles size={18} />
            </div>
            <strong>Your next step matters</strong>
            <p>
              Small, consistent actions can move your career journey forward.
            </p>
            {!admin && (
              <NavLink to="/app/assessment" onClick={closeMobileMenu}>
                Continue assessment <span aria-hidden="true">→</span>
              </NavLink>
            )}
          </div>

          <button className="nav-link logout-link" onClick={demoLogout}>
            <LogOut size={18} />
            <span>Exit</span>
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronLeft size={14} className="breadcrumb-chevron" />
            <strong>{admin ? "Administration" : "Career journey"}</strong>
          </div>

          <div className="topbar-actions">
            {/* <span className="demo-label">DEMO MODE</span> */}
            <button
              className="icon-button notification-button"
              aria-label="View notifications"
              onClick={() => navigate("/app/progress")}
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <button
              className="profile-chip"
              onClick={() => navigate(admin ? "/admin" : "/app/profile")}
              aria-label="Open profile"
            >
              <span className="avatar">{admin ? "AD" : initials}</span>
              <span className="profile-chip-name">
                <strong>{admin ? "Administrator" : displayName}</strong>
                <small>{admin ? "Admin workspace" : "Student account"}</small>
              </span>
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>Career Navigator</span>
          <span>Prototype · v1</span>
        </footer>
      </div>
    </div>
  );
}
