import { useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

interface Photo {
  id: string;
  title: string;
  category: string;
}

const initialPhotos = [
  { id: "1", title: "Networking Lab", category: "work" },
  { id: "2", title: "Team Building", category: "events" },
  { id: "3", title: "Graduation Day", category: "personal" },
];

const AdminGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [form, setForm] = useState({ title: "", category: "" });
  const { toast } = useToast();

  const addPhoto = () => {
    if (!form.title || !form.category) return;
    setPhotos([...photos, { ...form, id: Date.now().toString() }]);
    setForm({ title: "", category: "" });
    toast({ title: "Photo added" });
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
    toast({ title: "Photo removed" });
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
            <Label>Category</Label>
            <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="work, events, personal" className="mt-1" />
          </div>
          <Button onClick={addPhoto} className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Photos ({photos.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="p-3 rounded-lg bg-secondary/50 flex items-center gap-3">
              <ImageIcon className="h-8 w-8 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{photo.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{photo.category}</p>
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
