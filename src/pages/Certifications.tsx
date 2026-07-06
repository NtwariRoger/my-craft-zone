import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { CVDownload } from "@/components/CVDownload";
import { supabase } from "@/integrations/supabase/client";

interface Cert {
  id: string;
  title: string;
  issuer: string;
  year: number | null;
  credential_url: string | null;
  image_url: string | null;
}

const Certifications = () => {
  const [items, setItems] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("certifications").select("*").order("sort_order");
      setItems((data ?? []) as Cert[]);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Certifications" subtitle="Verified credentials and professional achievements." />

        <div className="flex justify-center mb-10">
          <CVDownload variant="outline" />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground">No certifications added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((c, i) => (
              <motion.a
                key={c.id}
                href={c.credential_url ?? "#"}
                target={c.credential_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="glass rounded-xl p-5 hover:glow transition-all duration-300 flex gap-4 group"
              >
                {c.image_url ? (
                  <img src={c.image_url} alt={c.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{c.title}</h3>
                    {c.credential_url && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{c.issuer}</p>
                  {c.year && <p className="text-xs text-muted-foreground mt-2">{c.year}</p>}
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Certifications;
