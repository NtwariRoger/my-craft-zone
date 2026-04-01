import { Layout } from "@/components/Layout";
import { SectionHeading } from "@/components/SectionHeading";
import { AnimatedCard } from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { Download, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Profile" subtitle="A snapshot of who I am" />

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Profile Card */}
            <AnimatedCard className="md:col-span-1 flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarFallback className="text-3xl font-bold bg-primary/20 text-primary">NR</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold mb-1">NTWARI Roger Haverson</h3>
              <p className="text-sm text-muted-foreground mb-3">Networking Engineer & Data Analyst</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="h-3 w-3" /> Rwanda
              </div>
              <Button className="w-full gap-2">
                <Download className="h-4 w-4" /> Download CV
              </Button>
            </AnimatedCard>

            {/* Details */}
            <div className="md:col-span-2 space-y-6">
              <AnimatedCard delay={0.1}>
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-lg">Education</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Bachelor's in Networking & Data Analysis</p>
                    <p className="text-sm text-muted-foreground">University — 2020–2024</p>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard delay={0.2}>
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold text-lg">Experience</h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">Network Engineer Intern</p>
                    <p className="text-sm text-muted-foreground">Company — 2023–Present</p>
                    <p className="text-sm text-muted-foreground mt-1">Designed and maintained LAN/WAN infrastructure, performed data analysis on network traffic.</p>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
