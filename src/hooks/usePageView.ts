import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function usePageView() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    supabase.functions
      .invoke("log-pageview", {
        body: {
          path: pathname.slice(0, 500) || "/",
          referrer: document.referrer?.slice(0, 500) || null,
        },
      })
      .catch(() => {});
  }, [pathname]);
}
