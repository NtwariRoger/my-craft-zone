import { motion } from "framer-motion";
import { ArrowRight, Code, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Testimonials } from "@/components/Testimonials";
import { CVDownload } from "@/components/CVDownload";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <Layout>
      <SEO
        title="NTWARI Roger Haverson — Networking Engineer & Data Analyst"
        description="Portfolio of NTWARI Roger Haverson — networking engineer and data analyst building robust network infrastructure and turning data into insight."
        path="/"
      />
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
                Welcome to my portfolio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              Hi, I'm{" "}
              <span className="text-gradient">NTWARI Roger Haverson</span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mt-3">
                Networking Engineer & Data Analyst
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            >
              Networking Engineer & Data Analyst crafting robust network solutions and extracting insights from complex data.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/projects">
                  View Projects <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">Contact Me</Link>
              </Button>
              <CVDownload variant="ghost" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Quick highlights */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            { icon: Code, title: "Network Engineering", desc: "Designing and managing enterprise-grade network infrastructure" },
            { icon: BarChart3, title: "Data Analysis", desc: "Transforming raw data into actionable business insights" },
            { icon: ArrowRight, title: "Problem Solving", desc: "Building efficient, scalable solutions for real-world challenges" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-xl p-6 hover:glow transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
