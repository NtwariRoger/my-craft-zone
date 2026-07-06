import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CV_PATH = "cv.pdf";

export function CVDownload({ variant = "default" }: { variant?: "default" | "outline" | "ghost" }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.storage.from("cv").createSignedUrl(CV_PATH, 3600, {
        download: "NTWARI_Roger_Haverson_CV.pdf",
      });
      if (data?.signedUrl) setUrl(data.signedUrl);
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
