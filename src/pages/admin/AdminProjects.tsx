import { useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  category: "personal" | "education";
  published: boolean;
}

const initialProjects: Project[] = [
  { id: "1", title: "Network Traffic Analyzer", description: "Real-time network traffic analysis tool", technologies: "Python, Wireshark, Pandas", category: "personal", published: true },
  { id: "2", title: "Campus Network Design", description: "Full campus network with VLANs and routing", technologies: "Cisco Packet Tracer, OSPF", category: "education", published: true },
];

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState({ title: "", description: "", technologies: "", category: "personal" as const });
  const { toast } = useToast();

  const addProject = () => {
    if (!form.title) return;
    setProjects([...projects, { ...form, id: Date.now().toString(), published: true }]);
    setForm({ title: "", description: "", technologies: "", category: "personal" });
    toast({ title: "Project added" });
  };

  const togglePublish = (id: string) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    toast({ title: "Project removed" });
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
              onChange={(e) => setForm({ ...form, category: e.target.value as "personal" | "education" })}
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
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={2} />
          </div>
        </div>
        <Button className="mt-3 gap-2" onClick={addProject}>
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
                  {!p.published && <Badge variant="outline" className="text-xs">Draft</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{p.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => togglePublish(p.id)}>
                {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
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
