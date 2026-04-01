import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Monitor, Server, Database, Wrench, Shield, BarChart3
} from "lucide-react";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  icon: React.ElementType;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Networking",
    icon: Server,
    skills: [
      { name: "Cisco (CCNA/CCNP)", level: 85 },
      { name: "LAN/WAN Design", level: 90 },
      { name: "TCP/IP & Routing", level: 88 },
      { name: "VPN & Firewalls", level: 80 },
    ],
  },
  {
    title: "Data Analysis",
    icon: BarChart3,
    skills: [
      { name: "Python (Pandas, NumPy)", level: 82 },
      { name: "SQL & Databases", level: 85 },
      { name: "Power BI / Tableau", level: 78 },
      { name: "Excel & Data Modeling", level: 88 },
    ],
  },
  {
    title: "Frontend",
    icon: Monitor,
    skills: [
      { name: "HTML / CSS", level: 80 },
      { name: "JavaScript", level: 75 },
      { name: "React", level: 70 },
      { name: "Tailwind CSS", level: 75 },
    ],
  },
  {
    title: "Backend & Databases",
    icon: Database,
    skills: [
      { name: "Node.js", level: 65 },
      { name: "MongoDB", level: 70 },
      { name: "MySQL", level: 80 },
      { name: "REST APIs", level: 72 },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    skills: [
      { name: "Network Security", level: 82 },
      { name: "Penetration Testing", level: 65 },
      { name: "Wireshark", level: 85 },
      { name: "Linux Administration", level: 78 },
    ],
  },
  {
    title: "Tools & Platforms",
    icon: Wrench,
    skills: [
      { name: "Git & GitHub", level: 80 },
      { name: "Docker", level: 60 },
      { name: "AWS / Azure", level: 55 },
      { name: "Packet Tracer / GNS3", level: 90 },
    ],
  },
];

const Skills = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Skills" subtitle="Technologies and tools I work with" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {skillCategories.map((cat, catIdx) => (
              <AnimatedCard key={cat.title} delay={catIdx * 0.1}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <cat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{cat.title}</h3>
                </div>
                <div className="space-y-4">
                  {cat.skills.map((skill) => (
                    <div key={skill.name}>
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
        </div>
      </section>
    </Layout>
  );
};

export default Skills;
