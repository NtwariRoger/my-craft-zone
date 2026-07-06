import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[];
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost(data as Post | null);
      setLoading(false);
    })();
  }, [slug]);

  return (
    <Layout>
      <article className="py-16 container mx-auto px-4 max-w-3xl">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
          <Link to="/blog"><ArrowLeft className="h-4 w-4 mr-1" /> All posts</Link>
        </Button>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !post ? (
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-2">Post not found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist or isn't published.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{post.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : ""}
            </div>

            {post.cover_image && (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full aspect-video object-cover rounded-xl mb-8 border border-border"
              />
            )}

            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-code:text-accent prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
          </>
        )}
      </article>
    </Layout>
  );
};

export default BlogPost;
