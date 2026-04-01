import { useState } from "react";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

const initialMessages: Message[] = [
  { id: "1", name: "John Doe", email: "john@example.com", message: "Great portfolio! Let's connect and discuss potential collaboration on a network monitoring project.", date: "2 hours ago", read: false },
  { id: "2", name: "Jane Smith", email: "jane@example.com", message: "Interested in your data analysis work. Would love to chat about opportunities.", date: "1 day ago", read: false },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", message: "Amazing networking projects! Your campus network design is impressive.", date: "3 days ago", read: true },
];

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { toast } = useToast();

  const markRead = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const removeMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    toast({ title: "Message deleted" });
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        {unread > 0 && <Badge>{unread} new</Badge>}
      </div>

      <div className="space-y-3">
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
                <p className="text-sm text-muted-foreground">{msg.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{msg.date}</p>
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
