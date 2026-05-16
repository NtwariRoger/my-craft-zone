import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  category: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<"all" | "personal" | "education">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      setProjects((data ?? []) as Project[]);
      setLoading(false);
    })();
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Projects" subtitle="Showcasing my work and contributions" />

          <div className="flex justify-center gap-2 mb-10">
            {(["all", "personal", "education"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f === "all" ? "All Projects" : f}
              </Button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {filtered.map((project, i) => (
                <AnimatedCard key={project.id} delay={i * 0.05}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={project.category === "personal" ? "default" : "secondary"} className="text-xs">
                      {project.category}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded-md bg-secondary text-secondary-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" /> Code
                        </a>
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" /> Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
