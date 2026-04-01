import { useState } from "react";
import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  github?: string;
  demo?: string;
  category: "personal" | "education";
}

const projects: Project[] = [
  {
    title: "Network Traffic Analyzer",
    description: "Real-time network traffic analysis tool that captures and visualizes packet data, identifies anomalies, and generates reports for network optimization.",
    technologies: ["Python", "Wireshark", "Pandas", "Matplotlib"],
    github: "#",
    category: "personal",
  },
  {
    title: "Data Dashboard for ISP",
    description: "Interactive dashboard displaying bandwidth usage, uptime metrics, and customer data analytics for a local internet service provider.",
    technologies: ["Power BI", "SQL", "Python", "Excel"],
    demo: "#",
    category: "personal",
  },
  {
    title: "Automated Network Config Tool",
    description: "CLI tool to automate Cisco router and switch configurations using Python scripts and SSH connections.",
    technologies: ["Python", "Paramiko", "Cisco IOS", "Git"],
    github: "#",
    category: "personal",
  },
  {
    title: "Campus Network Design",
    description: "Designed a full campus network with VLANs, inter-VLAN routing, DHCP, and firewall rules using Cisco Packet Tracer.",
    technologies: ["Cisco Packet Tracer", "VLAN", "OSPF", "ACL"],
    category: "education",
  },
  {
    title: "Student Records Analysis",
    description: "Data analysis project using Python to analyze student performance data and generate insights on trends and outcomes.",
    technologies: ["Python", "Pandas", "Seaborn", "Jupyter"],
    github: "#",
    category: "education",
  },
  {
    title: "Hospital Network Infrastructure",
    description: "End-to-end network architecture design for a hospital, including wireless, security, and server room planning.",
    technologies: ["GNS3", "Cisco", "Network Security", "WLAN"],
    category: "education",
  },
];

const Projects = () => {
  const [filter, setFilter] = useState<"all" | "personal" | "education">("all");

  const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Projects" subtitle="Showcasing my work and contributions" />

          {/* Filter */}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((project, i) => (
              <AnimatedCard key={project.title} delay={i * 0.05}>
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
                  {project.github && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-1" /> Code
                      </a>
                    </Button>
                  )}
                  {project.demo && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" /> Demo
                      </a>
                    </Button>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
