import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowRight } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  published_at: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, cover_image, tags, published_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      setPosts((data ?? []) as Post[]);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout>
      <section className="py-20 container mx-auto px-4">
        <SectionHeading title="Blog & Articles" subtitle="Thoughts on networking, data analysis, and building systems." />
        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts published yet. Check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p, i) => (
              <AnimatedCard key={p.id} delay={i * 0.05} className="p-0 overflow-hidden group">
                <Link to={`/blog/${p.slug}`} className="block">
                  {p.cover_image && (
                    <div className="aspect-video overflow-hidden bg-secondary">
                      <img
                        src={p.cover_image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {p.tags?.slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{p.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
                      </span>
                      <span className="flex items-center gap-1 text-primary font-medium">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Blog;
