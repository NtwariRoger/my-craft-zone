import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Check if the file exists first to avoid noisy errors.
    const { data: list } = await supabase.storage.from("cv").list("", { search: "cv.pdf" });
    const exists = (list ?? []).some((f) => f.name === "cv.pdf");
    if (!exists) return json({ url: null });

    const { data, error } = await supabase.storage
      .from("cv")
      .createSignedUrl("cv.pdf", 3600, { download: "NTWARI_Roger_Haverson_CV.pdf" });

    if (error || !data?.signedUrl) return json({ url: null });
    return json({ url: data.signedUrl });
  } catch {
    return json({ url: null });
  }
});
