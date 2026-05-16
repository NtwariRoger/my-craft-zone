import { useEffect, useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  subject: string | null;
  created_at: string;
  read: boolean;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const load = async () => {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    else setMessages((data ?? []) as Message[]);
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id: string) => {
    await supabase.from("messages").update({ read: true }).eq("id", id);
    load();
  };

  const removeMessage = async (id: string) => {
    await supabase.from("messages").delete().eq("id", id);
    toast({ title: "Message deleted" });
    load();
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        {unread > 0 && <Badge>{unread} new</Badge>}
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
        {messages.map((msg, i) => (
          <AnimatedCard key={msg.id} delay={i * 0.05} className={!msg.read ? "border-primary/30" : ""}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{msg.name}</span>
                  {!msg.read && <Badge variant="default" className="text-xs">New</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{msg.email}</p>
                {msg.subject && <p className="text-xs font-medium mb-1">{msg.subject}</p>}
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!msg.read && (
                  <Button variant="ghost" size="icon" onClick={() => markRead(msg.id)}>
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => removeMessage(msg.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
};

export default AdminMessages;
