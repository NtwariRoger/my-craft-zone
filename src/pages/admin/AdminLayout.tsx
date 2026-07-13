import { Link, useLocation, Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, User, Wrench, FolderOpen, Image, MessageSquare, LogOut, ShieldAlert,
  FileText, Star, Award, Briefcase, BarChart3, LogIn,
} from "lucide-react";

const sidebarLinks = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/profile", icon: User, label: "Profile" },
  { to: "/admin/skills", icon: Wrench, label: "Skills" },
  { to: "/admin/services", icon: Briefcase, label: "Services" },
  { to: "/admin/projects", icon: FolderOpen, label: "Projects" },
  { to: "/admin/certifications", icon: Award, label: "Certifications" },
  { to: "/admin/testimonials", icon: Star, label: "Testimonials" },
  { to: "/admin/gallery", icon: Image, label: "Gallery" },
  { to: "/admin/blog", icon: FileText, label: "Blog" },
  { to: "/admin/messages", icon: MessageSquare, label: "Messages" },
];

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    toast({ title: "Signed out", description: "You have been logged out of admin." });
    navigate("/admin/login");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-xl p-8 max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Admin sign in required</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Please sign in with your admin account to access this area.
          </p>
          <Button onClick={() => navigate("/admin/login")} className="gap-2">
            <LogIn className="h-4 w-4" /> Go to sign in
          </Button>
        </div>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-xl p-8 max-w-md text-center">
          <ShieldAlert className="h-10 w-10 text-destructive mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Not an admin</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Your account does not have admin access.
          </p>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
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
        <div className="p-3 border-t border-border space-y-2">
          {user?.email && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate" title={user.email}>
              Signed in as <span className="text-foreground">{user.email}</span>
            </div>
          )}
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold text-gradient">NRH</Link>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <main className="flex-1 p-6 md:p-8 overflow-auto md:pt-8 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
