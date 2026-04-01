import { Link, useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, User, Wrench, FolderOpen, Image, MessageSquare, LogOut
} from "lucide-react";

const sidebarLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/profile", icon: User, label: "Profile" },
  { to: "/admin/skills", icon: Wrench, label: "Skills" },
  { to: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { to: "/admin/gallery", icon: Image, label: "Gallery" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

const AdminLayout = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="text-lg font-bold text-gradient">NRH Admin</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={logout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-gradient">NRH</Link>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto md:pt-8 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
