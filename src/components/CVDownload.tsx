import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function CVDownload({ variant = "default" }: { variant?: "default" | "outline" | "ghost" }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("get-cv-url");
        if (data?.url) setUrl(data.url);
      } catch {
        // no CV uploaded yet — hide button silently
      }
    })();
  }, []);

  if (!url) return null;
  return (
    <Button asChild variant={variant} size="lg" className="gap-2">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <Download className="h-4 w-4" /> Download CV
      </a>
    </Button>
  );
}
