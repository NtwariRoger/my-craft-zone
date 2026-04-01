import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Image as ImageIcon } from "lucide-react";

interface Photo {
  id: number;
  title: string;
  category: string;
  placeholder: string; // Color placeholder
}

const photos: Photo[] = [
  { id: 1, title: "Networking Lab", category: "work", placeholder: "hsl(210, 100%, 20%)" },
  { id: 2, title: "Team Building", category: "events", placeholder: "hsl(172, 66%, 25%)" },
  { id: 3, title: "Conference 2024", category: "events", placeholder: "hsl(260, 60%, 25%)" },
  { id: 4, title: "Server Room", category: "work", placeholder: "hsl(210, 80%, 15%)" },
  { id: 5, title: "Graduation Day", category: "personal", placeholder: "hsl(30, 60%, 25%)" },
  { id: 6, title: "Hackathon Win", category: "events", placeholder: "hsl(150, 60%, 20%)" },
  { id: 7, title: "Nature Walk", category: "personal", placeholder: "hsl(120, 40%, 20%)" },
  { id: 8, title: "Data Center Visit", category: "work", placeholder: "hsl(200, 70%, 18%)" },
  { id: 9, title: "Weekend Trip", category: "personal", placeholder: "hsl(340, 50%, 25%)" },
];

const categories = ["all", "work", "events", "personal"];

const Gallery = () => {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Photo | null>(null);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Gallery" subtitle="Moments captured along the way" />

          <div className="flex justify-center gap-2 mb-10">
            {categories.map((c) => (
              <Button
                key={c}
                variant={filter === c ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(c)}
                className="capitalize"
              >
                {c}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {filtered.map((photo, i) => (
              <AnimatedCard
                key={photo.id}
                delay={i * 0.05}
                className="cursor-pointer p-0 overflow-hidden group"
              >
                <div
                  onClick={() => setSelected(photo)}
                  className="aspect-square flex items-center justify-center relative"
                  style={{ background: photo.placeholder }}
                >
                  <ImageIcon className="h-10 w-10 text-white/30" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">{photo.title}</p>
                      <p className="text-white/70 text-xs capitalize">{photo.category}</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card">
          <DialogTitle className="sr-only">{selected?.title}</DialogTitle>
          {selected && (
            <div>
              <div
                className="aspect-video flex items-center justify-center"
                style={{ background: selected.placeholder }}
              >
                <ImageIcon className="h-16 w-16 text-white/30" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{selected.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">{selected.category}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
