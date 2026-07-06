import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import * as icons from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  price: string | null;
  features: string[];
}

const Services = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("services").select("*").order("sort_order");
      setItems((data ?? []) as Service[]);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <section className="py-20 container mx-auto px-4">
        <SectionHeading
          title="Services & Pricing"
          subtitle="Network engineering and data analysis services tailored to your needs."
        />

        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">No services listed yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((s, i) => {
              const IconCmp = (s.icon && (icons as any)[s.icon]) || icons.Sparkles;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="glass rounded-xl p-6 hover:glow transition-all duration-300 flex flex-col"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <IconCmp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{s.description}</p>
                  {s.price && (
                    <p className="text-2xl font-bold text-gradient mt-4">{s.price}</p>
                  )}
                  {s.features?.length > 0 && (
                    <ul className="space-y-2 mt-4 flex-1">
                      {s.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button asChild variant="outline" className="mt-6 gap-2">
                    <Link to="/contact">
                      Get in touch <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Services;
