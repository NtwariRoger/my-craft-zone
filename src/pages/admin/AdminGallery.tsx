import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

const AdminGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [form, setForm] = useState({ title: "", description: "", image_url: "" });
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.from("gallery").select("*").order("sort_order");
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else setPhotos((data ?? []) as Photo[]);
  };

  useEffect(() => { load(); }, []);

  const addPhoto = async () => {
    if (!form.title || !form.image_url) return;
    const { error } = await supabase.from("gallery").insert(form);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    setForm({ title: "", description: "", image_url: "" });
    toast({ title: "Photo added" });
    load();
  };

  const removePhoto = async (id: string) => {
    await supabase.from("gallery").delete().eq("id", id);
    toast({ title: "Photo removed" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Gallery</h1>

      <AnimatedCard className="mb-6">
        <h3 className="font-semibold mb-4">Add Photo</h3>
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Category / Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="work, events, personal" className="mt-1" />
          </div>
          <div>
            <Label>Image URL</Label>
            <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" className="mt-1" />
          </div>
        </div>
        <Button onClick={addPhoto} className="gap-2 mt-3">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Photos ({photos.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="p-3 rounded-lg bg-secondary/50 flex items-center gap-3">
              <img src={photo.image_url} alt={photo.title} className="h-12 w-12 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{photo.title}</p>
                <p className="text-xs text-muted-foreground capitalize truncate">{photo.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removePhoto(photo.id)} className="text-destructive shrink-0">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminGallery;
