import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function usePageView() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    supabase
      .from("page_views")
      .insert({
        path: pathname.slice(0, 500) || "/",
        referrer: document.referrer?.slice(0, 500) || null,
        user_agent: navigator.userAgent?.slice(0, 500) || null,
      })
      .then(() => {});
  }, [pathname]);
}
