DROP POLICY IF EXISTS "page_views public insert" ON public.page_views;
REVOKE INSERT ON public.page_views FROM anon, authenticated;