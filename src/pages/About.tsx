import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { SEO } from "@/components/SEO";
import { Target, Heart, Lightbulb } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <SEO
        title="About NTWARI Roger Haverson — Networking Engineer & Data Analyst"
        description="Learn about NTWARI Roger Haverson, a Rwandan networking engineer and data analyst passionate about network architecture, cybersecurity, and data-driven decisions."
        path="/about"
      />
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeading title="About Me" subtitle="Learn more about my journey and passions" />

          <AnimatedCard className="mb-8">
            <p className="text-muted-foreground leading-relaxed">
              I'm NTWARI Roger Haverson, a passionate networking engineer and data analyst from Rwanda.
              I specialize in designing and managing robust network infrastructure, while leveraging
              data analytics to drive informed decision-making. My journey in technology began with
              a curiosity for how interconnected systems work, and has evolved into a career focused
              on building reliable, efficient networks and extracting meaningful insights from data.
            </p>
          </AnimatedCard>

          <div className="grid md:grid-cols-3 gap-6">
            <AnimatedCard delay={0.1}>
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Career Goals</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                To become a leading network architect and data strategist, contributing to digital
                transformation across Africa and beyond.
              </p>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="flex items-center gap-3 mb-3">
                <Heart className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Interests</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Cybersecurity & Cloud Computing</li>
                <li>• Machine Learning for Network Optimization</li>
                <li>• Photography & Travel</li>
                <li>• Open-Source Community</li>
              </ul>
            </AnimatedCard>

            <AnimatedCard delay={0.3}>
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Hobbies</h3>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Playing football</li>
                <li>• Reading tech blogs</li>
                <li>• Gaming</li>
                <li>• Mentoring students</li>
              </ul>
            </AnimatedCard>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
