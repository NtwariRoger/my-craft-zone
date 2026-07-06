import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  price: string | null;
  features: string[];
}

const emptyForm = { title: "", description: "", icon: "Sparkles", price: "", features: "" };

const AdminServices = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setItems((data ?? []) as Service[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title) return toast({ title: "Title required", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("services").insert({
      title: form.title,
      description: form.description,
      icon: form.icon || null,
      price: form.price || null,
      features: form.features.split(",").map((f) => f.trim()).filter(Boolean),
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setForm(emptyForm);
    toast({ title: "Service added" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Services</h1>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4">Add Service</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" /></div>
          <div>
            <Label>Icon (lucide-react name)</Label>
            <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Network, BarChart3, Shield…" className="mt-1" />
          </div>
          <div><Label>Price</Label><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$500/project or Contact" className="mt-1" /></div>
          <div><Label>Features (comma-separated)</Label><Input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="mt-1" /></div>
          <div className="md:col-span-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
        </div>
        <Button className="mt-3 gap-2" onClick={add} disabled={busy}><Plus className="h-4 w-4" /> Add</Button>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Services ({items.length})</h3>
        <div className="space-y-3">
          {items.map((s) => (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{s.title}</span>
                  {s.price && <span className="text-xs text-primary">{s.price}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{s.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminServices;
