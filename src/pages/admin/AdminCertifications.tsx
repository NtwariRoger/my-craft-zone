import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Cert {
  id: string;
  title: string;
  issuer: string;
  year: number | null;
  credential_url: string | null;
  image_url: string | null;
}

const emptyForm = { title: "", issuer: "", year: new Date().getFullYear(), credential_url: "", image_url: "" };

const AdminCertifications = () => {
  const [items, setItems] = useState<Cert[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvExists, setCvExists] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data } = await supabase.from("certifications").select("*").order("sort_order");
    setItems((data ?? []) as Cert[]);
  };

  const checkCv = async () => {
    const { data } = await supabase.storage.from("cv").list("", { search: "cv.pdf" });
    setCvExists((data ?? []).some((f) => f.name === "cv.pdf"));
  };

  useEffect(() => { load(); checkCv(); }, []);

  const add = async () => {
    if (!form.title || !form.issuer) return toast({ title: "Title and issuer required", variant: "destructive" });
    setBusy(true);
    const { error } = await supabase.from("certifications").insert({
      title: form.title,
      issuer: form.issuer,
      year: form.year,
      credential_url: form.credential_url || null,
      image_url: form.image_url || null,
    });
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setForm(emptyForm);
    toast({ title: "Certification added" });
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const uploadCV = async (file: File) => {
    setUploading(true);
    const { error } = await supabase.storage.from("cv").upload("cv.pdf", file, {
      upsert: true,
      contentType: file.type || "application/pdf",
    });
    setUploading(false);
    if (error) return toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    toast({ title: "CV uploaded" });
    checkCv();
  };

  const removeCV = async () => {
    const { error } = await supabase.storage.from("cv").remove(["cv.pdf"]);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "CV removed" });
    checkCv();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Certifications & CV</h1>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4" /> CV / Resume</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Upload a PDF. Visitors can download it from the Certifications page.
          {cvExists && <span className="ml-2 text-primary font-medium">✓ CV is live</span>}
        </p>
        <div className="flex gap-2">
          <label className="inline-flex">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadCV(e.target.files[0])}
            />
            <Button asChild variant="outline" className="gap-2" disabled={uploading}>
              <span><Upload className="h-4 w-4" /> {uploading ? "Uploading…" : cvExists ? "Replace CV" : "Upload CV"}</span>
            </Button>
          </label>
          {cvExists && <Button variant="ghost" onClick={removeCV} className="text-destructive gap-2"><Trash2 className="h-4 w-4" /> Remove</Button>}
        </div>
      </AnimatedCard>

      <AnimatedCard className="mb-6" delay={0.05}>
        <h3 className="font-semibold mb-4">Add Certification</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" /></div>
          <div><Label>Issuer</Label><Input value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="mt-1" /></div>
          <div><Label>Year</Label><Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="mt-1" /></div>
          <div><Label>Credential URL</Label><Input value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} className="mt-1" /></div>
          <div className="md:col-span-2"><Label>Image URL (logo/badge)</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1" /></div>
        </div>
        <Button className="mt-3 gap-2" onClick={add} disabled={busy}><Plus className="h-4 w-4" /> Add</Button>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Certifications ({items.length})</h3>
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.issuer} {c.year && `• ${c.year}`}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(c.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">No certifications yet.</p>}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminCertifications;
