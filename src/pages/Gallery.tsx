import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
}

const Gallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("gallery").select("*").order("sort_order");
      setPhotos((data ?? []) as Photo[]);
    })();
  }, []);

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Gallery" subtitle="Moments captured along the way" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {photos.map((photo, i) => (
              <AnimatedCard
                key={photo.id}
                delay={i * 0.05}
                className="cursor-pointer p-0 overflow-hidden group"
              >
                <div
                  onClick={() => setSelected(photo)}
                  className="aspect-square relative bg-secondary"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">{photo.title}</p>
                      {photo.description && (
                        <p className="text-white/70 text-xs capitalize">{photo.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card">
          <DialogTitle className="sr-only">{selected?.title}</DialogTitle>
          {selected && (
            <div>
              <img src={selected.image_url} alt={selected.title} className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-4">
                <h3 className="font-semibold">{selected.title}</h3>
                {selected.description && (
                  <p className="text-sm text-muted-foreground capitalize">{selected.description}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
