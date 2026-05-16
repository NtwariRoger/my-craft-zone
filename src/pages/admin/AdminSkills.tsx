import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "", level: 50 });
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.from("skills").select("*").order("sort_order");
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setSkills((data ?? []) as Skill[]);
  };

  useEffect(() => { load(); }, []);

  const addSkill = async () => {
    if (!newSkill.name || !newSkill.category) return;
    const { error } = await supabase.from("skills").insert(newSkill);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setNewSkill({ name: "", category: "", level: 50 });
    toast({ title: "Skill added" });
    load();
  };

  const removeSkill = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Skill removed" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Skills</h1>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4">Add New Skill</h3>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div>
            <Label>Name</Label>
            <Input value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} placeholder="e.g. Docker" className="mt-1" />
          </div>
          <div>
            <Label>Category</Label>
            <Input value={newSkill.category} onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })} placeholder="e.g. Tools" className="mt-1" />
          </div>
          <div>
            <Label>Level ({newSkill.level}%)</Label>
            <Input type="range" min={0} max={100} value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })} className="mt-1" />
          </div>
          <Button onClick={addSkill} className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Current Skills ({skills.length})</h3>
        <div className="space-y-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <Progress value={skill.level} className="h-1.5" />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{skill.category}</span>
              <Button variant="ghost" size="icon" onClick={() => removeSkill(skill.id)} className="text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminSkills;
