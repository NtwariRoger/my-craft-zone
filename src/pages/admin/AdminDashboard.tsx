import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { FolderOpen, Wrench, Image, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ projects: 0, skills: 0, gallery: 0, messages: 0 });
  const [recent, setRecent] = useState<RecentMessage[]>([]);

  useEffect(() => {
    (async () => {
      const [pr, sk, ga, ms, rec] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("skills").select("*", { count: "exact", head: true }),
        supabase.from("gallery").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*", { count: "exact", head: true }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      setCounts({
        projects: pr.count ?? 0,
        skills: sk.count ?? 0,
        gallery: ga.count ?? 0,
        messages: ms.count ?? 0,
      });
      setRecent((rec.data ?? []) as RecentMessage[]);
    })();
  }, []);

  const stats = [
    { label: "Projects", value: counts.projects, icon: FolderOpen, color: "text-primary" },
    { label: "Skills", value: counts.skills, icon: Wrench, color: "text-accent" },
    { label: "Photos", value: counts.gallery, icon: Image, color: "text-primary" },
    { label: "Messages", value: counts.messages, icon: MessageSquare, color: "text-accent" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

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

      <AnimatedCard delay={0.2}>
        <h3 className="font-semibold mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {recent.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
          {recent.map((msg) => (
            <div key={msg.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50">
              <div className="min-w-0">
                <p className="text-sm font-medium">{msg.name}</p>
                <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminDashboard;
