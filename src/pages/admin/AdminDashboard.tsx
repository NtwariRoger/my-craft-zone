import { AnimatedCard } from "@/components/AnimatedCard";
import { FolderOpen, Wrench, Image, MessageSquare, Eye, TrendingUp } from "lucide-react";

const stats = [
  { label: "Projects", value: 6, icon: FolderOpen, color: "text-primary" },
  { label: "Skills", value: 24, icon: Wrench, color: "text-accent" },
  { label: "Photos", value: 9, icon: Image, color: "text-primary" },
  { label: "Messages", value: 3, icon: MessageSquare, color: "text-accent" },
];

const recentMessages = [
  { name: "John Doe", email: "john@example.com", message: "Great portfolio! Let's connect.", date: "2 hours ago" },
  { name: "Jane Smith", email: "jane@example.com", message: "Interested in collaboration.", date: "1 day ago" },
  { name: "Mike Johnson", email: "mike@example.com", message: "Amazing networking projects!", date: "3 days ago" },
];

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <AnimatedCard key={stat.label} delay={i * 0.05}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Recent Messages */}
      <AnimatedCard delay={0.2}>
        <h3 className="font-semibold mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {recentMessages.map((msg) => (
            <div key={msg.email} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm font-medium">{msg.name}</p>
                <p className="text-xs text-muted-foreground">{msg.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.date}</span>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminDashboard;
