import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  github_url: string | null;
  demo_url: string | null;
}

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ title: "", description: "", technologies: "", category: "personal", github_url: "", demo_url: "" });
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setProjects((data ?? []) as Project[]);
  };

  useEffect(() => { load(); }, []);

  const addProject = async () => {
    if (!form.title) return;
    setBusy(true);
    const { error } = await supabase.from("projects").insert({
      title: form.title,
      description: form.description,
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      category: form.category,
      github_url: form.github_url || null,
      demo_url: form.demo_url || null,
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setForm({ title: "", description: "", technologies: "", category: "personal", github_url: "", demo_url: "" });
    toast({ title: "Project added" });
    load();
  };

  const removeProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Project removed" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Projects</h1>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4">Add New Project</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="personal">Personal</option>
              <option value="education">Education</option>
            </select>
          </div>
          <div>
            <Label>Technologies (comma-separated)</Label>
            <Input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Demo URL</Label>
            <Input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} />
          </div>
        </div>
        <Button className="mt-3 gap-2" onClick={addProject} disabled={busy}>
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Projects ({projects.length})</h3>
        <div className="space-y-3">
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{p.title}</span>
                  <Badge variant={p.category === "personal" ? "default" : "secondary"} className="text-xs">{p.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{p.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeProject(p.id)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminProjects;
