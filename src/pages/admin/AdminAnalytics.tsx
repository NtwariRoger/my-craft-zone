import { useEffect, useMemo, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import { Eye, TrendingUp, Globe, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface View {
  id: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

const AdminAnalytics = () => {
  const [views, setViews] = useState<View[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const since = new Date(Date.now() - range * 24 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from("page_views")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: true })
        .limit(5000);
      setViews((data ?? []) as View[]);
      setLoading(false);
    })();
  }, [range]);

  const { daily, topPaths, topReferrers, uniqueVisitors } = useMemo(() => {
    const byDay = new Map<string, number>();
    const pathCounts = new Map<string, number>();
    const refCounts = new Map<string, number>();
    const uas = new Set<string>();

    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
      byDay.set(d, 0);
    }

    for (const v of views) {
      const day = v.created_at.slice(0, 10);
      byDay.set(day, (byDay.get(day) ?? 0) + 1);
      pathCounts.set(v.path, (pathCounts.get(v.path) ?? 0) + 1);
      const ref = v.referrer ? new URL(v.referrer, "http://x").hostname.replace(/^www\./, "") : "Direct";
      refCounts.set(ref || "Direct", (refCounts.get(ref || "Direct") ?? 0) + 1);
      if (v.user_agent) uas.add(v.user_agent);
    }

    return {
      daily: Array.from(byDay.entries()).map(([date, count]) => ({
        date: date.slice(5),
        views: count,
      })),
      topPaths: Array.from(pathCounts.entries())
        .sort((a, b) => b[1] - a[1]).slice(0, 8)
        .map(([path, count]) => ({ path, count })),
      topReferrers: Array.from(refCounts.entries())
        .sort((a, b) => b[1] - a[1]).slice(0, 6)
        .map(([source, count]) => ({ source, count })),
      uniqueVisitors: uas.size,
    };
  }, [views, range]);

  const total = views.length;
  const avgPerDay = daily.length ? Math.round(total / daily.length) : 0;

  const stats = [
    { label: "Total views", value: total, icon: Eye, tint: "text-primary bg-primary/10" },
    { label: "Unique visitors", value: uniqueVisitors, icon: Users, tint: "text-accent bg-accent/10" },
    { label: `Avg / day`, value: avgPerDay, icon: TrendingUp, tint: "text-primary bg-primary/10" },
    { label: "Top pages", value: topPaths.length, icon: Globe, tint: "text-accent bg-accent/10" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="inline-flex rounded-lg border border-border bg-card p-1">
          {([7, 30, 90] as const).map((n) => (
            <button
              key={n}
              onClick={() => setRange(n)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === n ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Last {n} days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <AnimatedCard key={s.label} delay={i * 0.05} className="!p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.tint}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4">Views over time</h3>
        <div className="h-72">
          {loading ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Loading…</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily}>
                <defs>
                  <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="url(#v)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </AnimatedCard>

      <div className="grid md:grid-cols-2 gap-4">
        <AnimatedCard delay={0.05}>
          <h3 className="font-semibold mb-4">Top pages</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPaths} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                <YAxis dataKey="path" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1}>
          <h3 className="font-semibold mb-4">Top referrers</h3>
          <div className="space-y-2">
            {topReferrers.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
            {topReferrers.map((r) => (
              <div key={r.source} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
                <span className="text-sm truncate">{r.source}</span>
                <span className="text-sm font-semibold text-primary">{r.count}</span>
              </div>
            ))}
          </div>
        </AnimatedCard>
      </div>
    </div>
  );
};

export default AdminAnalytics;
