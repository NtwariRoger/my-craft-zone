import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
}

const emptyForm = { name: "", role: "", company: "", quote: "", avatar_url: "", rating: 5 };

const AdminTestimonials = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else setItems((data ?? []) as Testimonial[]);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.name || !form.quote) return toast({ title: "Name and quote required", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("testimonials").insert({
      name: form.name,
      role: form.role || null,
      company: form.company || null,
      quote: form.quote,
      avatar_url: form.avatar_url || null,
      rating: form.rating,
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setForm(emptyForm);
    toast({ title: "Testimonial added" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Testimonials</h1>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4">Add Testimonial</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
          <div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1" /></div>
          <div><Label>Company</Label><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-1" /></div>
          <div><Label>Avatar URL</Label><Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="mt-1" /></div>
          <div>
            <Label>Rating (1-5)</Label>
            <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-1" />
          </div>
          <div className="md:col-span-2"><Label>Quote</Label><Textarea rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} className="mt-1" /></div>
        </div>
        <Button className="mt-3 gap-2" onClick={add} disabled={busy}><Plus className="h-4 w-4" /> Add</Button>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Testimonials ({items.length})</h3>
        <div className="space-y-3">
          {items.map((t) => (
            <div key={t.id} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{[t.role, t.company].filter(Boolean).join(" • ")}</span>
                  {t.rating && <span className="flex items-center gap-0.5 text-xs"><Star className="h-3 w-3 fill-primary text-primary" />{t.rating}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">"{t.quote}"</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(t.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">No testimonials yet.</p>}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminTestimonials;
