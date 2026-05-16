import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Progress } from "@/components/ui/progress";
import { Wrench } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
}

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("skills").select("*").order("sort_order");
      setSkills((data ?? []) as Skill[]);
      setLoading(false);
    })();
  }, []);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ||= []).push(s);
    return acc;
  }, {});

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Skills" subtitle="Technologies and tools I work with" />

          {loading ? (
            <p className="text-center text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Object.entries(grouped).map(([category, items], catIdx) => (
                <AnimatedCard key={category} delay={catIdx * 0.1}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{category}</h3>
                  </div>
                  <div className="space-y-4">
                    {items.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
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

export default Skills;
