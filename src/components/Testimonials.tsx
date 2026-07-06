import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeading } from "@/components/SectionHeading";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("testimonials").select("*").order("sort_order");
      setItems((data ?? []) as Testimonial[]);
    })();
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="py-20 border-t border-border">
      <div className="container mx-auto px-4">
        <SectionHeading title="What people say" subtitle="Feedback from colleagues, clients, and collaborators." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass rounded-xl p-6 hover:glow transition-all duration-300 flex flex-col"
            >
              <Quote className="h-6 w-6 text-primary/60 mb-3" />
              <p className="text-sm text-foreground/90 flex-1 leading-relaxed">"{t.quote}"</p>
              {t.rating != null && (
                <div className="flex gap-0.5 mt-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < (t.rating ?? 0) ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[t.role, t.company].filter(Boolean).join(" • ")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
