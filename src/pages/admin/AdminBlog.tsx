import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, X, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
}

const emptyForm = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_image: "",
  tags: "",
  published: false,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const AdminBlog = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setPosts((data ?? []) as Post[]);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPreview(false);
  };

  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setForm({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      content: p.content,
      cover_image: p.cover_image ?? "",
      tags: (p.tags ?? []).join(", "),
      published: p.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.title || !form.content) {
      return toast({ title: "Title and content required", variant: "destructive" });
    }
    setBusy(true);
    const slug = form.slug ? slugify(form.slug) : slugify(form.title);
    const payload = {
      slug,
      title: form.title,
      excerpt: form.excerpt || null,
      content: form.content,
      cover_image: form.cover_image || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
    };
    const { error } = editingId
      ? await supabase.from("blog_posts").update(payload).eq("id", editingId)
      : await supabase.from("blog_posts").insert(payload);
    setBusy(false);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: editingId ? "Post updated" : "Post created" });
    reset();
    load();
  };

  const togglePublish = async (p: Post) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ published: !p.published, published_at: !p.published ? new Date().toISOString() : null })
      .eq("id", p.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Post deleted" });
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Blog</h1>

      <AnimatedCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">{editingId ? "Edit Post" : "New Post"}</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreview((v) => !v)} className="gap-2">
              {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {preview ? "Edit" : "Preview"}
            </Button>
            {editingId && (
              <Button variant="ghost" size="sm" onClick={reset} className="gap-2">
                <X className="h-4 w-4" /> Cancel
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Slug (optional, auto from title)</Label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="my-post" className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Cover image URL</Label>
            <Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Tags (comma-separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="networking, cisco" className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="mt-1" rows={2} />
          </div>
          <div className="md:col-span-2">
            <Label>Content (Markdown supported)</Label>
            {preview ? (
              <div className="mt-1 min-h-[240px] rounded-md border border-input bg-background p-4 prose prose-invert max-w-none prose-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content || "*Nothing to preview*"}</ReactMarkdown>
              </div>
            ) : (
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="mt-1 font-mono text-sm"
                rows={14}
                placeholder="# Heading&#10;&#10;Write your post using **Markdown**..."
              />
            )}
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
            <Label className="!m-0">Publish immediately</Label>
          </div>
        </div>
        <Button className="mt-4 gap-2" onClick={save} disabled={busy}>
          <Plus className="h-4 w-4" /> {editingId ? "Update Post" : "Create Post"}
        </Button>
      </AnimatedCard>

      <AnimatedCard delay={0.1}>
        <h3 className="font-semibold mb-4">Posts ({posts.length})</h3>
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm truncate">{p.title}</span>
                  <Badge variant={p.published ? "default" : "secondary"} className="text-xs">
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                  {p.tags?.slice(0, 3).map((t) => (
                    <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">/{p.slug}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => togglePublish(p)} title={p.published ? "Unpublish" : "Publish"}>
                {p.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-muted-foreground">No posts yet.</p>}
        </div>
      </AnimatedCard>
    </div>
  );
};

export default AdminBlog;
