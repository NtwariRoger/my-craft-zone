import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const { signIn, signUp, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  if (!loading && isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) {
      toast({ title: "Sign in failed", description: error, variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signUp(email, password, displayName);
    setBusy(false);
    if (error) {
      toast({ title: "Sign up failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Account created", description: "You can now sign in." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm glass rounded-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">Sign in to manage your portfolio</p>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="email-in">Email</Label>
                <Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password-in">Password</Label>
                <Input id="password-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Signing in…" : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="name-up">Display name</Label>
                <Input id="name-up" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email-up">Email</Label>
                <Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password-up">Password</Label>
                <Input id="password-up" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Creating…" : "Create Account"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                The very first account becomes the admin.
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLogin;
