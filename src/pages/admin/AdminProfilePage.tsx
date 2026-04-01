import { useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const AdminProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "NTWARI Roger Haverson",
    title: "Networking Engineer & Data Analyst",
    email: "roger@example.com",
    phone: "+250 7XX XXX XXX",
    location: "Kigali, Rwanda",
    bio: "Passionate networking engineer and data analyst from Rwanda, specializing in designing and managing robust network infrastructure.",
    education: "Bachelor's in Networking & Data Analysis",
    university: "University — 2020–2024",
  });

  const handleSave = () => {
    toast({ title: "Profile updated", description: "Your profile has been saved." });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Profile</h1>
      <AnimatedCard>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Title</Label>
            <Input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Education</Label>
            <Input value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label>Bio</Label>
            <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={4} className="mt-1" />
          </div>
        </div>
        <Button className="mt-4 gap-2" onClick={handleSave}>
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </AnimatedCard>
    </div>
  );
};

export default AdminProfile;
